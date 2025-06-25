import { type FC } from 'react'
import styles from './styles.module.css'

const SectionHeading: FC = () => {
	return (
		<div className={styles.top__container}>
			<div className={styles.heading}>
				<h2>Built for next-gen web creators</h2>
			</div>

			<div className={styles.description}>
				<p>
					DisPlan is shaped by the practices and principles that distinguish world-class web teams
					from the rest: purposeful design, rapid iteration, and an obsession with
					pixel-perfect execution.
				</p>
			</div>
		</div>
	)
}

export default SectionHeading
