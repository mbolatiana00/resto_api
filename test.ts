import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const restaurants = await prisma.restaurant.findMany()
  console.log('Restaurants:', restaurants)
  
  // Test création commande
  const order = await prisma.order.create({
    data: {
      userId: 2,
      restaurantId: 3,
      pickupAddress: 'test',
      deliveryAddress: 'test',
      totalPrice: 15.99,
    }
  })
  console.log('Commande créée:', order)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())