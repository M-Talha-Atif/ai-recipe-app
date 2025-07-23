// src/services/logmealService.js
import axios from 'axios';
import Constants from 'expo-constants';
const API_KEY = 'Bearer ' + Constants.expoConfig.extra.DETECTION_KEY;
const API_URL = 'https://api.logmeal.com/v2/image/segmentation/complete/v1.0?language=eng';

export const recognizeFoodFromImage = async (base64Image) => {
    try {
        // 1. First check image size
        console.log(`Original image size: ${base64Image.length} bytes`);

        // 2. Compress if needed (under 1MB)
        let processedBase64 = base64Image;
        if (base64Image.length > 1000000) {
            console.warn('Image too large, compressing...');
            processedBase64 = await compressBase64Image(base64Image);
            console.log(`Compressed size: ${processedBase64.length} bytes`);
        }

        // 3. Prepare form data
        const formData = new FormData();
        formData.append('image', {
            uri: `data:image/jpeg;base64,${processedBase64}`,
            name: 'food_photo.jpg',
            type: 'image/jpeg',
        });

        // 4. API call with timing
        console.log('Sending to LogMeal API...');
        const startTime = Date.now();

        const response = await axios.post(API_URL, formData, {
            headers: {
                'Authorization': API_KEY,
                'Content-Type': 'multipart/form-data',
            },
            maxContentLength: 1048576, // 1MB
            maxBodyLength: 1048576,    // 1MB
        });

        const duration = Date.now() - startTime;
        console.log(`API response in ${duration}ms`, response.data);

        // 5. Process results from segmentation_results
        const segmentation = response.data?.segmentation_results || [];

        if (segmentation.length === 0) {
            console.warn('No segmentation results found');
            return [];
        }

        // Extract food names from nested recognition_results
        const foodNames = [];

        segmentation.forEach(seg => {
            (seg.recognition_results || []).forEach(rec => {
                if (rec.name && !foodNames.includes(rec.name)) {
                    foodNames.push(rec.name);
                }
            });
        });

        console.log('Extracted food names:', foodNames);
        return foodNames;

    } catch (error) {
        const errorDetails = {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
        };
        console.error('API Failure:', JSON.stringify(errorDetails, null, 2));

        throw new Error(
            error.response?.data?.message ||
            'Food recognition failed. Please try a clearer photo.'
        );
    }
};

// Helper function to compress base64 image
const compressBase64Image = async (base64, quality = 0.7) => {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = `data:image/jpeg;base64,${base64}`;

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 800;
            const scale = MAX_WIDTH / img.width;

            canvas.width = MAX_WIDTH;
            canvas.height = img.height * scale;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            resolve(
                canvas.toDataURL('image/jpeg', quality)
                    .replace(/^data:image\/jpeg;base64,/, '')
            );
        };
    });
};