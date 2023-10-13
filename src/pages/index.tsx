import { HomeContainer, ProductContainer } from '@app/styles/module'
import Image from 'next/image'
import shirt1 from '@app/assets/camisetas/1.png'
import shirt2 from '@app/assets/camisetas/2.png'
import shirt3 from '@app/assets/camisetas/3.png'

export default function Home() {
  return (
    <>
      <HomeContainer>
        <ProductContainer>
          <Image src={shirt1} alt="Camiseta 1" width={520} height={480} />
          <footer>
            <strong>Camiseta X</strong>
            <span>R$ 79,90</span>
          </footer>
        </ProductContainer>
        <ProductContainer>
          <Image src={shirt2} alt="Camiseta 2" width={520} height={480} />
          <footer>
            <strong>Camiseta X</strong>
            <span>R$ 79,90</span>
          </footer>
        </ProductContainer>
        <ProductContainer>
          <Image src={shirt3} alt="Camiseta 3" width={520} height={480} />
          <footer>
            <strong>Camiseta X</strong>
            <span>R$ 79,90</span>
          </footer>
        </ProductContainer>
      </HomeContainer>
    </>
  )
}
