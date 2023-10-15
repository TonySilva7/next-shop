import stripe from '@app/lib/stripe'
import {
  ImageContainer,
  ProductDetailContainer,
  ProductItemContainer,
} from '@app/styles/pages'
import axios from 'axios'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import Stripe from 'stripe'
type Product = {
  id: string
  name: string
  imageUrl: string
  price: string
  description: string | null
  defaultPriceId: string
}
type IReturn = {
  product: Product
}
type IParams = { id: string }

export const getStaticProps: GetStaticProps<IReturn, IParams> = async ({
  params,
}) => {
  const productId = params?.id

  const product = await stripe.products.retrieve(productId as string, {
    expand: ['default_price'],
  })

  const price = product.default_price as Stripe.Price // em centavos
  const priceMapped = (price.unit_amount as number) / 100
  const priceFormatted = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(priceMapped)

  return {
    props: {
      product: {
        id: product.id,
        name: product.name,
        imageUrl: product.images[0],
        price: priceFormatted,
        description: product.description,
        defaultPriceId: price.id,
      },
    },
    revalidate: 60 * 60 * 1, // 1 hour
  }
}

export const getStaticPaths = async () => {
  const response = await stripe.products.list()

  const paths = response.data.map((product) => ({
    params: {
      id: product.id,
    },
  }))

  return {
    paths,
    fallback: false,
  }
}

type ViewProductProps = InferGetStaticPropsType<typeof getStaticProps>

export default function ViewProduct({ product }: ViewProductProps) {
  const [isLoading, setIsLoading] = useState(false)
  const handleBuyProduct = async () => {
    try {
      setIsLoading(true)
      const response = await axios.post('/api/checkout', {
        priceId: product.defaultPriceId,
      })

      const { checkoutUrl } = response.data

      window.location.href = checkoutUrl
    } catch (error) {
      setIsLoading(false)
      alert((error as { message: string }).message)
    }
  }

  return (
    <>
      <Head>
        <title>{product.name} | E-commerce</title>
      </Head>

      <ProductItemContainer>
        <ImageContainer>
          <Image
            src={product.imageUrl}
            width={520}
            height={480}
            alt={product.description ?? ''}
          />
        </ImageContainer>

        <ProductDetailContainer>
          <h1>{product.name}</h1>
          <span>{product.price}</span>
          <p>{product.description ?? ''}</p>

          <button onClick={handleBuyProduct} disabled={isLoading}>
            Comprar agora
          </button>
        </ProductDetailContainer>
      </ProductItemContainer>
    </>
  )
}
