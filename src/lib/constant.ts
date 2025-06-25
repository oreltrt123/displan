// modernProductCards.ts
import  CarouselCardProps  from '@/components/sections/modern-product-teams/components/carousel-card'

export type CarouselCardProps = {
	id: string
	img: string
	title: string
	description?: string
}

export const modernProductCards: CarouselCardProps[] = [
	{
		id: 'modern-carousel-card-1',
		img: '/components/sections/ai_powered.png',
		title: 'AI-powered website builder for layouts, content, and design—all in one.',
		description: 'AI-powered website builder that instantly creates responsive layouts, generates content, applies modern design styles, optimizes SEO and accessibility, supports multi-language, and exports clean code for fast, professional website creation. Secure your website effortlessly by adding a custom password protection feature that keeps your site private, controlling access to sensitive or pre-launch content while maintaining ease of use and high security standards. Access a suite of free web applications in one place that enable you to build, code, customize, export websites and components seamlessly with no installation required, accelerating your web development workflow efficiently.',
	},
	{
		id: 'modern-carousel-card-2',
		img: '/components/sections/password_security.png',
		title: 'Secure your site with a custom password to keep it private.',
		description: 'Secure your website effortlessly by adding a custom password protection feature that keeps your site private, controlling access to sensitive or pre-launch content while maintaining ease of use and high security standards. Secure your site by effortlessly adding a unique password that ensures your content remains private, restricting access to authorized users only, with simple setup and strong protection.',
	},
	{
		id: 'modern-carousel-card-3',
		img: '/components/sections/apps.png',
		title: 'Access free web apps to build, code, and export sites—all in one place.',
		description: 'Access a suite of free web applications in one place that enable you to build, code, customize, export websites and components seamlessly with no installation required, accelerating your web development workflow efficiently. Access all-in-one free web apps that let you build, code, customize, and export websites and components effortlessly, without installs, streamlining your entire web development process.',
	},
]
