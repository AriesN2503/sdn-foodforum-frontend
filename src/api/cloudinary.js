export async function uploadImageToCloudinary(file) {
    const url = `https://api.cloudinary.com/v1_1/doqd4s5no/image/upload`;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'sdn302-foodforum');

    const response = await fetch(url, {
        method: 'POST',
        body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
        console.error('Cloudinary upload error:', data);
        throw new Error(data.error?.message || 'Upload to Cloudinary failed');
    }

    return data.secure_url; // URL ảnh đã upload
}

export async function uploadFileToCloudinary(file) {
    const url = `https://api.cloudinary.com/v1_1/doqd4s5no/raw/upload`;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'sdn302-foodforum');

    const response = await fetch(url, {
        method: 'POST',
        body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
        console.error('Cloudinary file upload error:', data);
        throw new Error(data.error?.message || 'Upload file to Cloudinary failed');
    }

    return {
        url: data.secure_url,
        original_filename: data.original_filename,
        display_name: data.display_name,
        bytes: data.bytes,
        resource_type: data.resource_type,
        public_id: data.public_id,
        format: data.format,
        ...data
    };
} 