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
    style: Record<string, any>
    content: Record<string, any>
    transitions?: Transition[]
  }
  
  export interface Section {
    id: string
    name: string
    elements: ElementType[]
  }
  
  export interface Project {
    id: string
    name: string
    sections: Section[]
  }