export interface AlignmentGuide {
    position: number
    type: 'horizontal' | 'vertical'
    length: number
    start: number
  }
  
  export function calculateAlignmentGuides(
    elementRect: DOMRect,
    otherElements: DOMRect[],
    threshold: number = 5
  ): AlignmentGuide[] {
    const guides: AlignmentGuide[] = [];
    
    // Element center points
    const elementCenterX = elementRect.left + elementRect.width / 2;
    const elementCenterY = elementRect.top + elementRect.height / 2;
    
    // Element edges
    const elementLeft = elementRect.left;
    const elementRight = elementRect.right;
    const elementTop = elementRect.top;
    const elementBottom = elementRect.bottom;
    
    otherElements.forEach(otherRect => {
      // Skip if it's the same element
      if (
        otherRect.left === elementRect.left &&
        otherRect.top === elementRect.top &&
        otherRect.width === elementRect.width &&
        otherRect.height === elementRect.height
      ) {
        return;
      }
      
      // Other element center points
      const otherCenterX = otherRect.left + otherRect.width / 2;
      const otherCenterY = otherRect.top + otherRect.height / 2;
      
      // Other element edges
      const otherLeft = otherRect.left;
      const otherRight = otherRect.right;
      const otherTop = otherRect.top;
      const otherBottom = otherRect.bottom;
      
      // Vertical center alignment
      if (Math.abs(elementCenterX - otherCenterX) < threshold) {
        guides.push({
          position: otherCenterX,
          type: 'vertical',
          length: Math.max(elementBottom, otherBottom) - Math.min(elementTop, otherTop),
          start: Math.min(elementTop, otherTop)
        });
      }
      
      // Horizontal center alignment
      if (Math.abs(elementCenterY - otherCenterY) < threshold) {
        guides.push({
          position: otherCenterY,
          type: 'horizontal',
          length: Math.max(elementRight, otherRight) - Math.min(elementLeft, otherLeft),
          start: Math.min(elementLeft, otherLeft)
        });
      }
      
      // Left edge alignment
      if (Math.abs(elementLeft - otherLeft) < threshold) {
        guides.push({
          position: otherLeft,
          type: 'vertical',
          length: Math.max(elementBottom, otherBottom) - Math.min(elementTop, otherTop),
          start: Math.min(elementTop, otherTop)
        });
      }
      
      // Right edge alignment
      if (Math.abs(elementRight - otherRight) < threshold) {
        guides.push({
          position: otherRight,
          type: 'vertical',
          length: Math.max(elementBottom, otherBottom) - Math.min(elementTop, otherTop),
          start: Math.min(elementTop, otherTop)
        });
      }
      
      // Top edge alignment
      if (Math.abs(elementTop - otherTop) < threshold) {
        guides.push({
          position: otherTop,
          type: 'horizontal',
          length: Math.max(elementRight, otherRight) - Math.min(elementLeft, otherLeft),
          start: Math.min(elementLeft, otherLeft)
        });
      }
      
      // Bottom edge alignment
      if (Math.abs(elementBottom - otherBottom) < threshold) {
        guides.push({
          position: otherBottom,
          type: 'horizontal',
          length: Math.max(elementRight, otherRight) - Math.min(elementLeft, otherLeft),
          start: Math.min(elementLeft, otherLeft)
        });
      }
    });
    
    return guides;
  }