import { ComponentProps } from 'react'

type ProductProps = ComponentProps<'main'>

export default function Product({ ...props }: ProductProps) {
  return (
    <main {...props}>
      <h1> Hello Product</h1>
    </main>
  )
}

export { type ProductProps }
