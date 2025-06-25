// CarouselCard.tsx
'use client'

import { type FC, useState } from 'react'
import Image from 'next/image'
import styles from './styles.module.css'
import { Plus, X } from 'lucide-react'

export type CarouselCardProps = {
	id: string
	img: string
	title: string
	description?: string
}

const CarouselCard: FC<CarouselCardProps> = ({ id, img, title, description }) => {
	const [showModal, setShowModal] = useState(false)

	return (
		<>
			<div className={styles.carousel__card}>
				<button className={styles.outter__container} onClick={() => setShowModal(true)}>
					<div className={styles.img__container}>
						<Image src={img} alt='' width={960} height={914} />
					</div>
					<div className={styles.text__container}>
						<div className={styles.title}>
							<span className='text-black dark:text-white'>{title}</span>
						</div>
						<div className={styles.icon__container}>
							<Plus />
						</div>
					</div>
				</button>
			</div>
			{showModal && (
				<div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
					<div className={styles.modal} onClick={(e) => e.stopPropagation()}>
						<button className={styles.closeButton} onClick={() => setShowModal(false)}>
							<X size={20} />
						</button>
						<h2 className={styles.modalTitle}>{title}</h2>
						<p className={styles.modalDescription}>{description}</p>
					</div>
				</div>
			)}
		</>
	)
}

export default CarouselCard
