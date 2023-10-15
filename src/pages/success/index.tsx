import stripe from '@app/lib/stripe'
import {
  ImageContainerSuccess,
  SuccessContainer,
} from '@app/styles/pages/success'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import Stripe from 'stripe'

type IReturnProduct = {
  customerName: string
  product: {
    id: string
    name: string
    imageUrl: string
    price: number
  }
}

type IResponse = Stripe.Response<Stripe.Checkout.Session>

export const getServerSideProps: GetServerSideProps<IReturnProduct> = async ({
  query,
}) => {
  if (!query.session_id) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const sessionId = String(query.session_id)

  const session: IResponse = await stripe.checkout.sessions.retrieve(
    sessionId,
    {
      expand: ['line_items', 'line_items.data.price.product'],
    },
  )

  const customerName = session.customer_details?.name as string
  const product = session.line_items?.data[0].price?.product as Stripe.Product

  console.log(product)

  const returnProduct: IReturnProduct = {
    customerName,
    product: {
      id: product.id,
      name: product.name,
      imageUrl: product.images[0],
      price: session.amount_total as number,
    },
  }

  return {
    props: returnProduct,
  }
}

type SuccessProps = InferGetServerSidePropsType<typeof getServerSideProps>

export default function Success({ customerName, product }: SuccessProps) {
  return (
    <>
      <Head>
        <title>Compra efetuada | E-commerce</title>
        <meta name="robots" content="noindex" />
      </Head>

      <SuccessContainer>
        <h1>Compra efetuada</h1>

        <ImageContainerSuccess>
          <Image src={product.imageUrl} width={120} height={110} alt="" />
        </ImageContainerSuccess>
        <p>
          Uhuul <strong>{customerName}</strong>, sua{' '}
          <strong>{product.name}</strong> está a caminho.
        </p>

        <Link href="/">Voltar ao catálogo</Link>
      </SuccessContainer>
    </>
  )
}
