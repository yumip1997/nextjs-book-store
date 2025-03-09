const nextConfig = {
    logging: {
        fetches: {
            fullUrl: true,
        }
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'shopping-phinf.pstatic.net',
            },
        ],  
    },  
}

export default nextConfig;