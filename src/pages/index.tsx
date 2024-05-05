import { HomeContainer, ProductContainer } from '@app/styles/module'
import 'keen-slider/keen-slider.min.css'
import { useKeenSlider } from 'keen-slider/react'

import stripe from '@app/lib/stripe'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Stripe from 'stripe'
import Head from 'next/head'

type Product = {
  id: string
  name: string
  imageUrl: string
  price: string
}

type ProductProps = {
  products: Product[]
}

export const getStaticProps: GetStaticProps<ProductProps> = async () => {
  const response = await stripe.products.list({
    expand: ['data.default_price'],
  })

  const products = response.data.map((product) => {
    const priceCents = product.default_price as Stripe.Price
    const price = (priceCents.unit_amount as number) / 100
    const priceFormatted = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price)

    return {
      id: product.id,
      name: product.name,
      imageUrl: product.images[0],
      price: priceFormatted,
    }
  })

  return {
    props: {
      products,
    },
    revalidate: 60 * 60 * 4, // 4 hours
  }
}

type HomeProps = InferGetStaticPropsType<typeof getStaticProps>

export default function Home({ products }: HomeProps) {
  const [slideRef] = useKeenSlider<HTMLDivElement>({
    slides: {
      perView: 3,
      spacing: 48,
    },
  })
  return (
    <>
      <Head>
        <title>Home | E-commerce</title>
      </Head>
      <HomeContainer ref={slideRef} className="keen-slider">
        {products.map((product) => (
          <Link href={`/product/${product.id}`} key={product.id}>
            <ProductContainer
              // href={`/product/${product.id}`}
              // key={product.id}
              className="keen-slider__slide"
            >
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
          </Link>
        ))}
      </HomeContainer>
    </>
  )
}
