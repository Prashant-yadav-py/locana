import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Locana - Nearby Stores & Shops Near Me',
    short_name: 'Locana',
    description: 'Find nearby stores, shops near me, local stores open now. Real-time product search.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#d7262f',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
