import { useRouter } from 'next/router'
import { ComponentProps } from 'react'

type ViewProductProps = ComponentProps<'main'>

export default function ViewProduct({ ...props }: ViewProductProps) {
  const { query } = useRouter()
  return (
    <main {...props}>
      <h1> Hello ViewProduct {query.id}</h1>
    </main>
  )
}

export { type ViewProductProps }
