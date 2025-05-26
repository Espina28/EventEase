"use client"

import { useEffect } from "react"
import HeaderHeroSection from "./header-hero-section"
import ServicesSection from "./services-section"
import EventHighlightsSection from "./event-highlights-section"
import TestimonialsSection from "./testimonials-section"
import CTASection from "./cta-section"

export default function HomePage() {
  useEffect(() => {
    // Add global styles for snap scrolling
    const style = document.createElement("style")
    style.textContent = `
      html {
        scroll-behavior: smooth;
        scroll-snap-type: y proximity; /* Changed from mandatory to proximity */
        overflow-y: scroll;
      }
      
      body {
        margin: 0;
        padding: 0;
      }
      
      .snap-section {
        scroll-snap-align: start;
        min-height: 100vh;
        width: 100%;
      }
    `
    document.head.appendChild(style)

    // Handle scroll end detection and snapping
    let scrollTimeout
    let isScrolling = false

    const handleScroll = () => {
      isScrolling = true
      clearTimeout(scrollTimeout)

      scrollTimeout = setTimeout(() => {
        if (!isScrolling) return
        isScrolling = false

        const sections = document.querySelectorAll(".snap-section")
        const scrollTop = window.scrollY
        const windowHeight = window.innerHeight
        const documentHeight = document.documentElement.scrollHeight

        // Don't snap if at the very top or bottom of the page
        if (scrollTop <= 10 || scrollTop >= documentHeight - windowHeight - 10) {
          return
        }

        // Find the section that's most in view
        let closestSection = null
        let maxVisiblePercentage = 0

        sections.forEach((section) => {
          const rect = section.getBoundingClientRect()
          const sectionHeight = rect.height

          // Calculate how much of the section is visible in the viewport
          const visibleTop = Math.max(0, rect.top)
          const visibleBottom = Math.min(windowHeight, rect.bottom)
          const visibleHeight = Math.max(0, visibleBottom - visibleTop)

          // Calculate percentage of the section that's visible
          const visiblePercentage = visibleHeight / sectionHeight

          if (visiblePercentage > maxVisiblePercentage) {
            maxVisiblePercentage = visiblePercentage
            closestSection = section
          }
        })

        // Only snap if a significant portion of a section is visible
        if (closestSection && maxVisiblePercentage > 0.3) {
          window.scrollTo({
            top: closestSection.offsetTop,
            behavior: "smooth",
          })
        }
      }, 200) // Slightly longer timeout for a more natural feel
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      document.head.removeChild(style)
      window.removeEventListener("scroll", handleScroll)
      clearTimeout(scrollTimeout)
    }
  }, [])

  return (
    <div>
      <div className="snap-section">
        <HeaderHeroSection />
      </div>
      <div className="snap-section">
        <ServicesSection />
      </div>
      <div className="snap-section">
        <EventHighlightsSection />
      </div>
      <div className="snap-section">
        <TestimonialsSection />
      </div>
    </div>
  )
}
