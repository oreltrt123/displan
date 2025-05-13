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
  transitions?: Transition[]
  children?: ElementType[]
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
  type: string
  created_at?: string
  updated_at?: string
  }
  



  export interface Transition {
    id: string
    property: string
    duration: number
    timingFunction: string
    delay: number
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
    path: string
  }

  export interface Website {
    id: string
    name: string
    pages: Page[]
  }
  

export interface ProjectContent {
  sections: Section[]
  globalStyles?: Record<string, any>
  pages?: Page[]
  settings?: ProjectSettings
}

export interface Section {
  id: string
  name: string
  elements: ElementType[]
}


export interface ProjectSettings {
  siteName: string
  favicon?: string
  theme?: {
    primaryColor?: string
    secondaryColor?: string
    fontFamily?: string
  }
}

export interface Transition {
  property: string
  duration: number
  timingFunction: string
  delay: number
  animation?: string
}
