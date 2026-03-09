import { ImageSourcePropType } from "react-native"

interface BannerTypes {
  id: number
  image: ImageSourcePropType
    title: string
    subtitle: string
}

export const banners: BannerTypes[] = [
  {
    id: 1,
    image: require('@/assets/banner/armear.jpeg'),
    title: "50% Off",
    subtitle: "On all earrings"
  },
  {
    id: 2,
    image: require('@/assets/banner/armearing.jpeg'),
    title: "30% Off",
    subtitle: "On all earrings"
  },
  {
    id: 3,
    image: require('@/assets/banner/armring1.jpeg'),
    title: "20% Off",
    subtitle: "On all earrings"
  },
]