import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaPencilAlt, FaTimes } from 'react-icons/fa'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router';

import { API_URL } from '@/config/index'
import EventMap from '@/components/EventMap'
import Layout from '@/components/Layout'
import styles from '@/styles/Event.module.css'

export default function EventPage({ evt, token }) {
  const router = useRouter()

  const deleteEvent = async (e) => {
    if(confirm('Are you sure')){
      const res = await fetch(`${API_URL}/events/${evt.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const data = await res.json()
      if(!res.ok){
        toast.error(data.message)
      }else{
        typeof window !== 'undefined' && router.push('/events')
      }
    }
  }

  return (
    <Layout>
      <div className={styles.event}>
        <div className={styles.controls}>
          <Link href={`/events/edit/${evt.id}`}>
            <a>
              <FaPencilAlt /> Edit Event
            </a>
          </Link>
          <a href="#" className={styles.delete} onClick={deleteEvent}>
            <FaTimes /> Delete Event
          </a>
        </div>
        <span>
          {new Date(evt.date).toLocaleDateString('tr-TR')} at {evt.time}
        </span>
        <h1>{evt.name}</h1>
        <ToastContainer/>
        {evt.image ? (
          <div className={styles.image}>
            <Image src={evt.image ? evt.image.formats.medium.url : console.log('/../images/event-default.png')} width={960} height={600} />
          </div>
        ): <div className={styles.image}>
        <Image src={'/images/event-default.png'} width={960} height={600} />
      </div>}
        <h3>Performers:</h3>
        <p>{evt.performers}</p>
        <h3>Description:</h3>
        <p>{evt.description}</p>
        <h3>Venue: {evt.venu}</h3>
        <p>{evt.address}</p>
        <EventMap evt={evt} />

        <Link href='/events'>
          <a className={styles.back}>{'<'} Go Back</a>
        </Link>
      </div>
    </Layout>
  )
}
export async function getStaticPaths() {
  const res = await fetch(`${API_URL}/events`)
  const events = await res.json()

  const paths = events.map((evt) => ({
    params: { slug: evt.slug },
  }))
  return {
    paths,
    fallback: true,
  }
}

export async function getStaticProps({ params: {slug} }) {
  const res = await fetch(`${API_URL}/events/?slug=${slug}`)
  const events = await res.json()
  return {
    props: {
      evt: events[0],
    },
    revalidate: 1,
  }
}
// export async function getServerSideProps({query: {slug}, req}){
//   const {token} = parseCookies(req)

//   const res = await fetch(`${API_URL}/api/events/${slug}`)
//   const events = await res.json()

//   return {
//     props: {
//       evt: events[0],
//       token
//     }
//   }
// }
