import { HomeContainer, ProductContainer } from '@app/styles/module'
import { useKeenSlider } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'

import Image from 'next/image'
import shirt1 from '@app/assets/camisetas/1.png'
import shirt2 from '@app/assets/camisetas/2.png'
import shirt3 from '@app/assets/camisetas/3.png'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import stripe from '@app/lib/stripe'
import Stripe from 'stripe'

type Product = {
  id: string
  name: string
  imageUrl: string
  price: number
}

type ProductProps = {
  products: Product[]
}

export const getServerSideProps: GetServerSideProps<
  ProductProps
> = async () => {
  const response = await stripe.products.list({
    expand: ['data.default_price'],
  })

  const products = response.data.map((product) => {
    const price = product.default_price as Stripe.Price

    return {
      id: product.id,
      name: product.name,
      imageUrl: product.images[0],
      price: (price.unit_amount as number) / 100,
    }
  })

  return {
    props: {
      products,
    },
  }
}

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>

export default function Home({ products }: PageProps) {
  const [slideRef] = useKeenSlider<HTMLDivElement>({
    slides: {
      perView: 3,
      spacing: 48,
    },
  })
  return (
    <>
      <HomeContainer ref={slideRef} className="keen-slider">
        {products.map((product) => (
          <ProductContainer key={product.id} className="keen-slider__slide">
            <Image
              src={product.imageUrl}
              alt="Camiseta 1"
              width={520}
              height={480}
              placeholder="empty"
            />
            <footer>
              <strong>{product.name}</strong>
              <span>{product.price}</span>
            </footer>
          </ProductContainer>
        ))}
      </HomeContainer>
    </>
  )
}
