export interface ElementType {
    id: string
    type: string
    content: {
      text?: string
      level?: string
      src?: string
      alt?: string
      href?: string
      buttonText?: string
      height?: string
      [key: string]: any
    }
    style: {
      color?: string
      backgroundColor?: string
      fontSize?: string
      fontWeight?: string
      textAlign?: string
      width?: string
      marginTop?: string
      marginBottom?: string
      marginLeft?: string
      marginRight?: string
      padding?: string
      borderRadius?: string
      border?: string
      [key: string]: any
    }
  }
  
  export interface Section {
    id: string
    name: string
    elements: ElementType[]
  }
  
  export interface Project {
    id: string
    name: string
    description: string
    content: {
      sections: Section[]
      globalStyles: {
        [key: string]: any
      }
    }
  }
  




  export interface Transition {
    id: string
    property: string
    duration: number
    timingFunction: string
    delay: number
  }
  
  export interface ElementType {
    id: string
    type: string
    name: string
  transitions?: {
    property: string
    duration: number
    timingFunction: string
    delay: number
    animation?: string
  }[]
  }

  export interface Section {
    id: string
    name: string
    elements: ElementType[]
  }
  
  export interface Page {
    id: string
    name: string
    sections: Section[]
  }
  
  export interface Website {
    id: string
    name: string
    pages: Page[]
  }
  