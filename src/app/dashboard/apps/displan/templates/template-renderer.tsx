import type React from "react"
import { EditableElement } from "../components/editor/editable-element"
import UserSearch from "../components/editor/canvas/user-search"
import ClickSelect from "../components/editor/canvas/click-select"
import ImageCarousel from "../components/editor/canvas/carousel"
import Cursor from "../components/editor/canvas/cursor"
import View from "../components/editor/canvas/view"
import Feedback from "../components/editor/canvas/feedback"
import Plan from "../components/editor/canvas/plan"
import Uploader from "../components/editor/canvas/file-uploader"
import AnimatedValue from "../components/editor/canvas/slider"
import InputShotcut from "../components/editor/canvas/input-shotcut"
import Loader from "../components/editor/canvas/loader"
import Template from "../components/editor/canvas/template"
import type { EditableTemplateElement, TextEditingState } from "../types/canvas-types"

interface TemplateRendererProps {
  templateId: string
  selectedTemplateElement: string | null
  selectedElements: string[]
  textEditingState: TextEditingState
  editableElements: Map<string, EditableTemplateElement>
  isPreviewMode: boolean
  getStableElementId: (templateId: string, elementKey: string) => string
  onTemplateElementClick: (elementId: string, elementType: string, content: string, event: React.MouseEvent) => void
  onTemplateElementDoubleClick: (elementId: string, content: string, event: React.MouseEvent) => void
  onTextChange: (elementId: string, newContent: string) => void
  onTextEditKeyDown: (e: React.KeyboardEvent, elementId: string) => void
  editInputRef: React.RefObject<HTMLInputElement>
}

export function TemplateRenderer(props: TemplateRendererProps) {
  const { templateId } = props

  const EditableElementWithProps = (elementProps: any) => <EditableElement {...elementProps} {...props} />

  // Helper function to create draggable template elements
  const createDraggableElement = (
    elementKey: string,
    elementType: string,
    content: string,
    children: React.ReactNode,
    className?: string,
    style?: React.CSSProperties,
  ) => {
    const elementId = props.getStableElementId(templateId, elementKey)
    const isSelected = props.selectedTemplateElement === elementId || props.selectedElements.includes(elementId)

    return (
      <div
        key={elementKey}
        data-template-element={elementId}
        className={`template-draggable-element ${isSelected ? "template-element-selected" : ""} ${className || ""}`}
        style={{
          position: "relative",
          cursor: props.isPreviewMode ? "default" : "move",
          outline: isSelected ? "2px solid #3b82f6" : "none",
          outlineOffset: "2px",
          ...style,
        }}
        onClick={(e) => {
          e.stopPropagation()
          if (!props.isPreviewMode) {
            props.onTemplateElementClick(elementId, elementType, content, e)
          }
        }}
        onDoubleClick={(e) => {
          e.stopPropagation()
          if (!props.isPreviewMode && elementType.startsWith("text-")) {
            props.onTemplateElementDoubleClick(elementId, content, e)
          }
        }}
      >
        <EditableElementWithProps
          templateId={templateId}
          elementKey={elementKey}
          elementType={elementType}
          content={content}
          className="template-element-content"
        >
          {children}
        </EditableElementWithProps>
        {!props.isPreviewMode && isSelected && (
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md pointer-events-none" />
        )}
      </div>
    )
  }

  switch (templateId) {
    case "template-1":
      return (
        <div className="bg-white py-24 sm:py-32">
          <div className="mx-auto grid max-w-7xl gap-20 px-6 lg:px-8 xl:grid-cols-3">
            <div className="max-w-xl">
              {createDraggableElement(
                "title",
                "text-heading",
                "Meet our leadership",
                <h2 className="text-3xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-4xl">
                  Meet our leadership
                </h2>,
              )}

              {createDraggableElement(
                "description",
                "text-paragraph",
                "We're a dynamic group of individuals who are passionate about what we do and dedicated to delivering the best results for our clients.",
                <p className="text-lg/8 text-gray-600">
                  We're a dynamic group of individuals who are passionate about what we do and dedicated to delivering
                  the best results for our clients.
                </p>,
                "mt-6",
              )}
            </div>

            <ul role="list" className="grid gap-x-8 gap-y-12 sm:grid-cols-2 sm:gap-y-16 xl:col-span-2">
              <li>
                <div className="flex items-center gap-x-6">
                  {createDraggableElement(
                    "avatar",
                    "image-profile",
                    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
                    <img
                      className="size-[35px] rounded-full"
                      src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                      alt=""
                    />,
                  )}

                  <div>
                    {createDraggableElement(
                      "name",
                      "text-name",
                      "Test Name",
                      <h3 className="text-base/7 font-semibold tracking-tight text-gray-900">Test Name</h3>,
                    )}

                    {createDraggableElement(
                      "role",
                      "text-role",
                      "Co-Founder / CEO",
                      <p className="text-sm/6 font-semibold text-indigo-600">Co-Founder / CEO</p>,
                    )}
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      )

    case "template-2":
      return (
        <section className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:px-8">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.100),white)] opacity-20" />
          <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white shadow-xl ring-1 shadow-indigo-600/10 ring-indigo-50 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />

          <div className="mx-auto max-w-2xl lg:max-w-4xl">
            {createDraggableElement(
              "logo",
              "image-logo",
              "/logo_light_mode.png",
              <img className="mx-auto h-12" src="/logo_light_mode.png" alt="" />,
            )}

            <figure className="mt-10">
              <blockquote className="text-center text-xl/8 font-semibold text-gray-900 sm:text-2xl/9">
                {createDraggableElement(
                  "quote",
                  "text-quote",
                  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo expedita voluptas culpa sapiente alias molestiae. Numquam corrupti in laborum sed rerum et corporis.",
                  <p>
                    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo expedita voluptas culpa sapiente
                    alias molestiae. Numquam corrupti in laborum sed rerum et corporis."
                  </p>,
                )}
              </blockquote>

              <figcaption className="mt-10">
                {createDraggableElement(
                  "testimonial-avatar",
                  "image-avatar",
                  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
                  <img
                    className="mx-auto size-10 rounded-full"
                    src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                    alt=""
                  />,
                )}

                <div className="mt-4 flex items-center justify-center space-x-3 text-base">
                  {createDraggableElement(
                    "testimonial-name",
                    "text-name",
                    "Test Name",
                    <div className="font-semibold text-gray-900">Test Name</div>,
                  )}

                  <svg viewBox="0 0 2 2" width="3" height="3" aria-hidden="true" className="fill-gray-900">
                    <circle cx="1" cy="1" r="1" />
                  </svg>

                  {createDraggableElement(
                    "testimonial-title",
                    "text-title",
                    "CEO of Workcation",
                    <div className="text-gray-600">CEO of Workcation</div>,
                  )}
                </div>
              </figcaption>
            </figure>
          </div>
        </section>
      )

    case "empty-0":
      return (
        <div className="bg-white py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:mx-0">
              {createDraggableElement(
                "blog-title",
                "text-heading",
                "From the blog",
                <h2 className="text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">
                  From the blog
                </h2>,
              )}

              {createDraggableElement(
                "blog-subtitle",
                "text-subtitle",
                "Learn how to grow your business with our expert advice.",
                <p className="text-lg/8 text-gray-600">Learn how to grow your business with our expert advice.</p>,
                "mt-2",
              )}
            </div>

            <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
              <article className="flex max-w-xl flex-col items-start justify-between">
                <div className="flex items-center gap-x-4 text-xs">
                  {createDraggableElement(
                    "article-date",
                    "text-date",
                    "Mar 16, 2020",
                    <time dateTime="2020-03-16" className="text-gray-500">
                      Mar 16, 2020
                    </time>,
                  )}

                  {createDraggableElement(
                    "article-category",
                    "button-category",
                    "Marketing",
                    <a
                      href="#"
                      className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100"
                    >
                      Marketing
                    </a>,
                  )}
                </div>

                <div className="group relative">
                  {createDraggableElement(
                    "article-title",
                    "text-article-title",
                    "Boost your conversion rate",
                    <h3 className="text-lg/6 font-semibold text-gray-900 group-hover:text-gray-600">
                      <a href="#">
                        <span className="absolute inset-0" />
                        Boost your conversion rate
                      </a>
                    </h3>,
                    "mt-3",
                  )}

                  {createDraggableElement(
                    "article-excerpt",
                    "text-excerpt",
                    "Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel. Iusto corrupti dicta.",
                    <p className="line-clamp-3 text-sm/6 text-gray-600">
                      Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid
                      explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel. Iusto
                      corrupti dicta.
                    </p>,
                    "mt-5",
                  )}
                </div>

                <div className="relative mt-8 flex items-center gap-x-4">
                  {createDraggableElement(
                    "author-avatar",
                    "image-author",
                    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
                    <img
                      src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                      alt=""
                      className="size-10 rounded-full bg-gray-50"
                    />,
                  )}

                  <div className="text-sm/6">
                    {createDraggableElement(
                      "author-name",
                      "text-author-name",
                      "Test Name",
                      <p className="font-semibold text-gray-900">
                        <a href="#">
                          <span className="absolute inset-0" />
                          Test Name
                        </a>
                      </p>,
                    )}

                    {createDraggableElement(
                      "author-role",
                      "text-author-role",
                      "Co-Founder / CTO",
                      <p className="text-gray-600">Co-Founder / CTO</p>,
                    )}
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      )

    case "empty-1":
      return (
        <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
          <div
            className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            aria-hidden="true"
          >
            <div
              className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>

          <div className="mx-auto max-w-2xl text-center">
            {createDraggableElement(
              "contact-title",
              "text-heading",
              "Contact sales",
              <h2 className="text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl">
                Contact sales
              </h2>,
            )}

            {createDraggableElement(
              "contact-subtitle",
              "text-subtitle",
              "Aute magna irure deserunt veniam aliqua magna enim voluptate.",
              <p className="text-lg/8 text-gray-600">Aute magna irure deserunt veniam aliqua magna enim voluptate.</p>,
              "mt-2",
            )}
          </div>

          <form action="#" method="POST" className="mx-auto mt-16 max-w-xl sm:mt-20">
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
              <div>
                {createDraggableElement(
                  "first-name-label",
                  "text-label",
                  "First name",
                  <label htmlFor="first-name" className="block text-sm/6 font-semibold text-gray-900">
                    First name
                  </label>,
                )}
                <div className="mt-2.5">
                  <input
                    type="text"
                    name="first-name"
                    id="first-name"
                    autoComplete="given-name"
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>

              <div>
                {createDraggableElement(
                  "last-name-label",
                  "text-label",
                  "Last name",
                  <label htmlFor="last-name" className="block text-sm/6 font-semibold text-gray-900">
                    Last name
                  </label>,
                )}
                <div className="mt-2.5">
                  <input
                    type="text"
                    name="last-name"
                    id="last-name"
                    autoComplete="family-name"
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>
            </div>

            <div className="mt-10">
              {createDraggableElement(
                "submit-button",
                "button-submit",
                "Let's talk",
                <button
                  type="submit"
                  className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Let's talk
                </button>,
              )}
            </div>
          </form>
        </div>
      )

    case "empty-2":
      return (
        <div className="relative isolate flex items-center gap-x-6 overflow-hidden bg-gray-50 px-6 py-2.5 sm:px-3.5 sm:before:flex-1">
          <div
            className="absolute top-1/2 left-[max(-7rem,calc(50%-52rem))] -z-10 -translate-y-1/2 transform-gpu blur-2xl"
            aria-hidden="true"
          >
            <div
              className="aspect-[577/310] w-[36.125rem] bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-30"
              style={{
                clipPath:
                  "polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%,41.9%,97.2%73.2%,100%34.9%,92.5%0.4%,87.5%0%,75%28.6%,58.5%54.6%,50.1%56.8%,46.9%44%,48.3%17.4%,24.7%53.9%,0%27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)",
              }}
            />
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {createDraggableElement(
              "announcement-text",
              "text-announcement",
              "DisPlan 2025 - Join us in Denver from June 7 – 9 to see what's coming next.",
              <p className="text-sm/6 text-gray-900">
                <strong className="font-semibold">DisPlan 2025</strong>
                <svg viewBox="0 0 2 2" className="mx-2 inline size-0.5 fill-current" aria-hidden="true">
                  <circle cx="1" cy="1" r="1" />
                </svg>
                Join us in Denver from June 7 – 9 to see what's coming next.
              </p>,
            )}

            {createDraggableElement(
              "register-button",
              "button-register",
              "Register now",
              <a
                href="#"
                className="flex-none rounded-full bg-gray-900 px-3.5 py-1 text-sm font-semibold text-white shadow-xs hover:bg-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
              >
                Register now <span aria-hidden="true">→</span>
              </a>,
            )}
          </div>

          <div className="flex flex-1 justify-end">
            <button type="button" className="-m-3 p-3 focus-visible:outline-offset-[-4px]">
              <span className="sr-only">Dismiss</span>
              <svg className="size-5 text-gray-900" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
              </svg>
            </button>
          </div>
        </div>
      )

    case "empty-3":
      return (
        <div className="bg-gray-50 py-24 sm:py-32">
          <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
            {createDraggableElement(
              "deploy-subtitle",
              "text-subtitle",
              "Deploy faster",
              <h2 className="text-center text-base/7 font-semibold text-indigo-600">Deploy faster</h2>,
            )}

            {createDraggableElement(
              "deploy-title",
              "text-heading",
              "Everything you need to deploy your app",
              <p className="text-4xl font-semibold tracking-tight text-balance text-gray-950 sm:text-5xl">
                Everything you need to deploy your app
              </p>,
              "mx-auto mt-2 max-w-lg text-center",
            )}

            <div className="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-3 lg:grid-rows-2">
              <div className="relative lg:row-span-2">
                <div className="absolute inset-px rounded-lg bg-white lg:rounded-l-[2rem]" />
                <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
                  <div className="px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
                    {createDraggableElement(
                      "feature-title",
                      "text-feature-title",
                      "Mobile friendly",
                      <p className="text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">
                        Mobile friendly
                      </p>,
                      "mt-2",
                    )}

                    {createDraggableElement(
                      "feature-description",
                      "text-feature-description",
                      "Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.",
                      <p className="text-sm/6 text-gray-600 max-lg:text-center">
                        Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.
                      </p>,
                      "mt-2 max-w-lg",
                    )}
                  </div>
                </div>
                <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm ring-1 ring-black/5 lg:rounded-l-[2rem]" />
              </div>
            </div>
          </div>
        </div>
      )

    case "empty-4":
      return (
        <div className="bg-white">
          <header className="absolute inset-x-0 top-0 z-50">
            <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
              <div className="flex lg:flex-1">
                {createDraggableElement(
                  "header-logo",
                  "image-logo",
                  "https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600",
                  <a href="#" className="-m-1.5 p-1.5">
                    <span className="sr-only">Your Company</span>
                    <img
                      className="h-8 w-auto"
                      src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                      alt=""
                    />
                  </a>,
                )}
              </div>

              <div className="hidden lg:flex lg:gap-x-12">
                {createDraggableElement(
                  "nav-product",
                  "button-nav",
                  "Product",
                  <a href="#" className="text-sm/6 font-semibold text-gray-900">
                    Product
                  </a>,
                )}

                {createDraggableElement(
                  "nav-features",
                  "button-nav",
                  "Features",
                  <a href="#" className="text-sm/6 font-semibold text-gray-900">
                    Features
                  </a>,
                )}

                {createDraggableElement(
                  "nav-marketplace",
                  "button-nav",
                  "Marketplace",
                  <a href="#" className="text-sm/6 font-semibold text-gray-900">
                    Marketplace
                  </a>,
                )}

                {createDraggableElement(
                  "nav-company",
                  "button-nav",
                  "Company",
                  <a href="#" className="text-sm/6 font-semibold text-gray-900">
                    Company
                  </a>,
                )}
              </div>

              <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                {createDraggableElement(
                  "login-button",
                  "button-login",
                  "Log in",
                  <a href="#" className="text-sm/6 font-semibold text-gray-900">
                    Log in <span aria-hidden="true">→</span>
                  </a>,
                )}
              </div>
            </nav>
          </header>

          <div className="relative isolate px-6 pt-14 lg:px-8">
            <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
              <div className="text-center">
                {createDraggableElement(
                  "hero-title",
                  "text-hero-title",
                  "Data to enrich your online business",
                  <h1 className="text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
                    Data to enrich your online business
                  </h1>,
                )}

                {createDraggableElement(
                  "hero-description",
                  "text-hero-description",
                  "Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat.",
                  <p className="text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
                    Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt
                    amet fugiat veniam occaecat.
                  </p>,
                  "mt-8",
                )}

                <div className="mt-10 flex items-center justify-center gap-x-6">
                  {createDraggableElement(
                    "cta-primary",
                    "button-primary",
                    "Get started",
                    <a
                      href="#"
                      className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Get started
                    </a>,
                  )}

                  {createDraggableElement(
                    "cta-secondary",
                    "button-secondary",
                    "Learn more",
                    <a href="#" className="text-sm/6 font-semibold text-gray-900">
                      Learn more <span aria-hidden="true">→</span>
                    </a>,
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )

    case "empty-5":
      return (
        <div className="relative isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            {createDraggableElement(
              "pricing-subtitle",
              "text-subtitle",
              "Pricing",
              <h2 className="text-base/7 font-semibold text-indigo-600">Pricing</h2>,
            )}

            {createDraggableElement(
              "pricing-title",
              "text-heading",
              "Choose your DisPlan plan for you",
              <p className="text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-6xl">
                Choose your DisPlan plan for you
              </p>,
              "mt-2",
            )}
          </div>

          {createDraggableElement(
            "pricing-description",
            "text-description",
            "Choose an affordable plan that's packed with the best features for engaging your audience, creating customer loyalty, and driving sales.",
            <p className="text-lg font-semibold text-pretty text-gray-600 sm:text-xl/8">
              Choose an affordable plan that's packed with the best features for engaging your audience, creating
              customer loyalty, and driving sales.
            </p>,
            "mx-auto mt-6 max-w-2xl text-center",
          )}

          <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
            <div className="rounded-3xl bg-white/60 p-8 ring-1 ring-gray-900/10 sm:mx-8 sm:rounded-b-none sm:p-10 lg:mx-0 lg:rounded-tr-none lg:rounded-bl-3xl">
              {createDraggableElement(
                "plan1-name",
                "text-plan-name",
                "Hobby",
                <h3 className="text-base/7 font-semibold text-indigo-600">Hobby</h3>,
              )}

              <p className="mt-4 flex items-baseline gap-x-2">
                {createDraggableElement(
                  "plan1-price",
                  "text-price",
                  "$29",
                  <span className="text-5xl font-semibold tracking-tight text-gray-900">$29</span>,
                )}
                <span className="text-base text-gray-500">/month</span>
              </p>

              {createDraggableElement(
                "plan1-description",
                "text-plan-description",
                "The perfect plan if you're just getting started with our product.",
                <p className="text-base/7 text-gray-600">
                  The perfect plan if you're just getting started with our product.
                </p>,
                "mt-6",
              )}

              {createDraggableElement(
                "plan1-cta",
                "button-plan-cta",
                "Get started today",
                <a
                  href="#"
                  className="rounded-md px-3.5 py-2.5 text-center text-sm font-semibold text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Get started today
                </a>,
                "mt-8 block sm:mt-10",
              )}
            </div>

            <div className="relative rounded-3xl bg-gray-900 p-8 shadow-2xl ring-1 ring-gray-900/10 sm:p-10">
              {createDraggableElement(
                "plan2-name",
                "text-plan-name",
                "Enterprise",
                <h3 className="text-base/7 font-semibold text-indigo-400">Enterprise</h3>,
              )}

              <p className="mt-4 flex items-baseline gap-x-2">
                {createDraggableElement(
                  "plan2-price",
                  "text-price",
                  "$99",
                  <span className="text-5xl font-semibold tracking-tight text-white">$99</span>,
                )}
                <span className="text-base text-indigo-200">/month</span>
              </p>

              {createDraggableElement(
                "plan2-description",
                "text-plan-description",
                "Dedicated support and infrastructure for your company.",
                <p className="text-base/7 text-indigo-200">Dedicated support and infrastructure for your company.</p>,
                "mt-6",
              )}

              {createDraggableElement(
                "plan2-cta",
                "button-plan-cta",
                "Get started today",
                <a
                  href="#"
                  className="rounded-md bg-indigo-500 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                  Get started today
                </a>,
                "mt-8 block sm:mt-10",
              )}
            </div>
          </div>
        </div>
      )

    // Keep the component templates as they are
    case "empty-6":
      return (
        <div className="p-8">
          <EditableElementWithProps
            templateId={templateId}
            elementKey="wrapper"
            elementType="component"
            content="UserSearch Component"
          >
            <UserSearch />
          </EditableElementWithProps>
        </div>
      )

    case "empty-7":
      return (
        <div className="p-8">
          <EditableElementWithProps
            templateId={templateId}
            elementKey="wrapper"
            elementType="component"
            content="ClickSelect Component"
          >
            <ClickSelect />
          </EditableElementWithProps>
        </div>
      )

    case "empty-8":
      return (
        <div className="p-8">
          <EditableElementWithProps
            templateId={templateId}
            elementKey="wrapper"
            elementType="component"
            content="ImageCarousel Component"
          >
            <ImageCarousel />
          </EditableElementWithProps>
        </div>
      )

    case "empty-9":
      return (
        <div className="">
          <EditableElementWithProps
            templateId={templateId}
            elementKey="wrapper"
            elementType="component"
            content="View Component"
          >
            <View />
          </EditableElementWithProps>
        </div>
      )

    case "empty-10":
      return (
        <div className="">
          <EditableElementWithProps
            templateId={templateId}
            elementKey="wrapper"
            elementType="component"
            content="AnimatedValue Component"
          >
            <AnimatedValue />
          </EditableElementWithProps>
        </div>
      )

    case "empty-11":
      return (
        <div className="">
          <EditableElementWithProps
            templateId={templateId}
            elementKey="wrapper"
            elementType="component"
            content="Cursor Component"
          >
            <Cursor />
          </EditableElementWithProps>
        </div>
      )

    case "empty-12":
      return (
        <div className="">
          <EditableElementWithProps
            templateId={templateId}
            elementKey="wrapper"
            elementType="component"
            content="Feedback Component"
          >
            <Feedback />
          </EditableElementWithProps>
        </div>
      )

    case "empty-13":
      return (
        <div className="p-8">
          <EditableElementWithProps
            templateId={templateId}
            elementKey="wrapper"
            elementType="component"
            content="Uploader Component"
          >
            <Uploader />
          </EditableElementWithProps>
        </div>
      )

    case "empty-14":
      return (
        <div className="p-8">
          <EditableElementWithProps
            templateId={templateId}
            elementKey="wrapper"
            elementType="component"
            content="InputShotcut Component"
          >
            <InputShotcut />
          </EditableElementWithProps>
        </div>
      )

    case "empty-15":
      return (
        <div className="p-8">
          <EditableElementWithProps
            templateId={templateId}
            elementKey="wrapper"
            elementType="component"
            content="Plan Component"
          >
            <Plan />
          </EditableElementWithProps>
        </div>
      )

    case "empty-16":
      return (
        <div className="p-8">
          <EditableElementWithProps
            templateId={templateId}
            elementKey="wrapper"
            elementType="component"
            content="Loader Component"
          >
            <Loader />
          </EditableElementWithProps>
        </div>
      )

    case "template_11":
      return (
        <div className="">
          <EditableElementWithProps
            templateId={templateId}
            elementKey="wrapper"
            elementType="component"
            content="Template Component"
          >
            <Template />
          </EditableElementWithProps>
        </div>
      )

    default:
      return (
        <div className="w-full h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded flex items-center justify-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {templateId.includes("template") ? `Template ${templateId.split("-")[1]}` : `Empty ${templateId}`}
          </span>
        </div>
      )
  }
}
