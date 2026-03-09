import { Stack } from "expo-router";
import '@/global.css';
import {QueryClient,QueryClientProvider} from '@tanstack/react-query'

const client = new QueryClient()
export default function RootLayout() {
  return (
    <QueryClientProvider client={client}>
      <Stack screenOptions={{headerShown:false}}/>
      </QueryClientProvider>
  )
}
