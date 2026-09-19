'use client';

import { useState } from 'react';
import { Box, Grid2, Card, CardMedia } from '@mui/material';
import { ProductImage } from '@/types/ProductType';
import withAuth from '@/hook/checkRoute';


const ProductImageGallery = ({ images }: { images: ProductImage[] }) => {
    const [selectedImage, setSelectedImage] = useState(images[0]?.urlPath || '');

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Card sx={{ width: '50%', height: 200, mb: 2 }}>
                <CardMedia
                    component="img"
                    image={selectedImage}
                    alt="Main product image"
                    sx={{ objectFit: 'contain', height: '100%', }}
                />
            </Card>
            {images.length > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Grid2 container spacing={1} justifyContent="center">
                        {images.map((img) => (
                            <Grid2 key={img.id}>
                                <Card
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        border:
                                            selectedImage === img.urlPath ? '2px solid #1976d2' : '1px solid #ccc',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => setSelectedImage(img.urlPath)}
                                >
                                    <CardMedia
                                        component="img"
                                        image={img.urlPath}
                                        alt={`Thumbnail ${img.id}`}
                                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </Card>
                            </Grid2>
                        ))}
                    </Grid2>
                </Box>
            )}
        </Box>
    );
}
export default withAuth(ProductImageGallery);
