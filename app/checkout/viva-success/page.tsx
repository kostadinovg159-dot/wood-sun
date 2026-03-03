import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { getVivaToken, VIVA_API_URL } from '@/lib/viva'

interface PageProps {
  searchParams: Promise<{ t?: string }>
}

export default async function VivaSuccessPage({ searchParams }: PageProps) {
  const { t: transactionId } = await searchParams

  if (!transactionId) {
    redirect('/checkout')
  }

  let verificationFailed = false

  try {
    const token = await getVivaToken()

    const txRes = await fetch(`${VIVA_API_URL}/checkout/v2/transactions/${transactionId}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })

    if (!txRes.ok) {
      console.error('Viva transaction verify failed:', txRes.status)
      verificationFailed = true
    } else {
      const tx = await txRes.json()
      const orderId: string | undefined = tx.merchantTrns

      // statusId 'F' = Full Capture (successful payment)
      if (orderId && tx.statusId === 'F') {
        await prisma.order.update({
          where: { id: orderId },
          data: {
            status: 'PAID',
            vivaTransactionId: transactionId,
          },
        })
      }
    }
  } catch (e) {
    console.error('Viva success page error:', e)
  }

  if (verificationFailed) {
    redirect('/checkout')
  }

  redirect('/account')
}
