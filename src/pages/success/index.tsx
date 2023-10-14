import stripe from '@app/lib/stripe'
import {
  ImageContainerSuccess,
  SuccessContainer,
} from '@app/styles/pages/success'
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  InferGetStaticPropsType,
  Redirect,
} from 'next'
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
  // notFound: boolean
  // redirect: Redirect
}

type IResponse = Stripe.Response<Stripe.Checkout.Session>

export const getServerSideProps: GetServerSideProps<IReturnProduct> = async ({
  query,
}) => {
  const sessionId = String(query.session_id)

  const session: IResponse = await stripe.checkout.sessions.retrieve(
    sessionId,
    {
      expand: ['line_items', 'line_items.data.price.product'],
    },
  )

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

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
    <SuccessContainer>
      <h1>Compra efetuada</h1>

      <ImageContainerSuccess>
        <Image src={product.imageUrl} width={120} height={110} alt="" />
      </ImageContainerSuccess>
      <p>
        Uhuul <strong>{customerName}</strong>, sua{' '}
        <strong>{product.name}</strong> está a caminho.
      </p>

      <Link href="/">Voltar para home</Link>
    </SuccessContainer>
  )
}
