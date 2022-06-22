import moment from 'moment'
import { FaImage } from 'react-icons/fa'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'
import axios from 'axios'

import Layout from '@/components/Layout'
import Modal from '@/components/Modal'
import ImageUpload from '@/components/ImageUpload'
import { API_URL } from '@/config/index'
import { parseCookies } from '@/helpers/index';
import styles from '@/styles/Form.module.css'

export default function EditEventPage({ evt, token }) {
  const [values, setValues] = useState({
    name: evt.name,
    performers: evt.performers,
    venue: evt.venue,
    address: evt.address,
    date: evt.date,
    time: evt.time,
    description: evt.description,
  })

  const [imagePreview, setImagePreview] = useState(
    evt.image ? evt.image.formats.thumbnail.url : null,
  )

  const [showModal, setShowModal] = useState(false)

  const router = typeof window !== 'undefined' && useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()

    //Validation
    const hasEmptyFields = Object.values(values).some(
      (element) => element === '',
    )
    if (hasEmptyFields) {
      toast.error('Please fill in all fields')
    }

    const res = await fetch(`${API_URL}/events/${evt.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(values),
    })

    if (!res.ok) {
      if(res.status === 403 || res.status === 401){
        toast.error('Unauthorized')
        return
      }
      toast.error('Something Went Wrong!')
    } else {
      const evt = await res.json()
      router.push(`/events/${evt.slug}`)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setValues({ ...values, [name]: value })
  }

  const imageUploaded = async (e) => {
    axios.get(`${API_URL}/events/${evt.id}`)
    .then(async function (response) {
      if(response.status === 200){
        await setImagePreview(response.data.image.formats.thumbnail.url)
        setShowModal(false)
      }else{
        toast.error('Something Went Wrong with server!')
        setShowModal(false)
      }
    })
    .catch(function ({response}) {
      if(response){
        if(response.status === 403 || response.status === 401){
          toast.error('Unauthorized')
          setShowModal(false)
          return
        }
        toast.error(`Something Went Wrong!: ${response.statusText}`)
        setShowModal(false)
      }
    });
  }

  return (
    <Layout title="Edit Event">
      <Link href="/events">Go Back</Link>
      <h1>Edit Event</h1>
      <ToastContainer />
      {evt ? (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.grid}>
            <div>
              <label htmlFor="name">Event Name</label>
              <input
                type="text"
                id="name"
                name="name"
                values={values.name}
                defaultValue={values.name}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="performers">Performers</label>
              <input
                type="text"
                id="performers"
                name="performers"
                values={values.performers}
                defaultValue={values.performers}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="venue">Venue</label>
              <input
                type="text"
                id="venue"
                name="venue"
                values={values.venue}
                defaultValue={values.venue}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                values={values.address}
                defaultValue={values.address}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="date">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                values={moment(values.date).format('yyyy-MM-DD')}
                defaultValue={moment(values.date).format('yyyy-MM-DD')}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="time">Time</label>
              <input
                type="text"
                name="time"
                id="time"
                values={values.time}
                defaultValue={values.time}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div>
            <label>Event Description</label>
            <textarea
              type="text"
              name="description"
              id="description"
              value={values.description}
              onChange={handleInputChange}
            ></textarea>
          </div>

          <input type="submit" value="Update Event" className="btn" />
        </form>
      ) : (
        <div className="btn"> Loading </div>
      )}

      <h2>Event Image</h2>
      {imagePreview ? (
        <Image src={imagePreview} height={100} width={170} />
      ) : (
        <div>
          <p>No Image uploaded</p>
        </div>
      )}

      <div>
        <button onClick={() => setShowModal(true)} className='btn-secondary btn-icon' >
          <FaImage/> Set Image
        </button>
      </div>

      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <ImageUpload evtId={evt.id} imageUploaded={imageUploaded} token={token}/>
      </Modal>
    </Layout>
  )
}

export async function getServerSideProps({ params: { id }, req }) {
  const {token} = parseCookies(req)

  const res = await fetch(`${API_URL}/events/${id}`)
  const evt = await res.json()

  return {
    props: {
      evt,
      token
    },
  }
}
