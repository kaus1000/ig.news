import { useSession, signIn} from 'next-auth/react';
import Router, { useRouter } from 'next/router';
import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';
import styles from './styles.module.scss';

interface SubscribeButtonProps {
    priceId: string;
}

//getServerSideProps (SSR)
//getStaticProps(SSG)
// API Routes

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
    const { data: session } = useSession()
    const router = useRouter()
    
    async function handleSubscribe() {
        if (!session) {
            signIn('github');
            return;
        }

        if (session.activeSubscription) {
            router.push('/posts');
            return;
        }

        try {
            const response = await api.post('/subscribe')

            const { sessionId } = response.data;

            const stripe = await getStripeJs()

            await stripe.redirectToCheckout({ sessionId })
        }catch (err) {
            alert(err.message);
        }
    }
    
    return (
        <button 
        type="button" 
        className={styles.subscribeButton}
        onClick={handleSubscribe}
        >
            Subscribe now
        </button>
    )
}