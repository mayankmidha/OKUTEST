'use client'

import { useEffect, useState } from 'react'

export default function WordPressContent() {
  const [currentText, setCurrentText] = useState('grief')

  useEffect(() => {
    const textArray = ['grief', 'longing', 'quiet', 'becoming', 'anger', 'story']
    const element = document.getElementById('change')
    let currentIndex = 0
    
    function changeText() {
      if (element) {
        element.textContent = textArray[currentIndex]
        currentIndex = (currentIndex + 1) % textArray.length
      }
    }
    
    // Start the rotation
    changeText()
    // Show first text immediately
    const interval = setInterval(changeText, 2000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div dangerouslySetInnerHTML={{ 
      __html: `
        <style>
          #change { font-family: 'Nothing You Could Do', cursive; font-size: 35px; font-weight: 400; }
          @media (max-width: 768px) { #change { font-size: 25px; } }
          
          /* Main button styling */
          .dynamic-button { 
            display: inline-block; 
            padding: 8px 40px; 
            background-color: transparent; 
            color: #2D2D2D; 
            text-decoration: none; 
            border-radius: 1050px; 
            font-family: 'Helvetica', Arial, sans-serif; 
            font-size: 16px; 
            font-weight: 400; 
            border: 1px solid #2D2D2D; 
            position: relative; 
            overflow: hidden; 
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); 
            z-index: 1; 
            cursor: pointer;
          } 
          /* Background fill that shrinks on hover */
          .dynamic-button::before { 
            content: ''; 
            position: absolute; 
            top: 0; 
            left: 0; 
            right: 0; 
            bottom: 0; 
            background-color: #2D2D2D; 
            border-radius: 50px; 
            transform: scale(1); 
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1); 
            z-index: -1;
          } 
          /* Chevron with background */
          .dynamic-button::after { 
            content: '›'; 
            position: absolute; 
            right: 20px; 
            top: 50%; 
            transform: translateY(-50%) scale(0); 
            background-color: #2D2D2D; 
            color: white; 
            width: 30px; 
            height: 30px; 
            border-radius: 50%; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            font-size: 16px; 
            font-weight: bold; 
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); 
            opacity: 0;
          } 
          /* Hover effects */
          .dynamic-button:hover { 
            color: #2D2D2D; 
            padding-right: 70px;
          } 
          .dynamic-button:hover::before { 
            transform: scale(0);
          } 
          .dynamic-button:hover::after { 
            transform: translateY(-50%) scale(1); 
            opacity: 1;
          }
          
          .elementor-section {
            position: relative;
          }
          
          .elementor-container {
            max-width: 1140px;
            margin: 0 auto;
            padding: 0 20px;
          }
          
          .elementor-widget-heading h2 {
            font-family: 'Playfair Display', serif;
            font-weight: 400;
            line-height: 1.2;
          }
          
          .elementor-widget-text-editor p {
            line-height: 1.6;
          }
        </style>
        
        <!-- Hero Section -->
        <div class="elementor-section elementor-top-section">
          <div class="elementor-container elementor-column-gap-default">
            <div class="elementor-row">
              <div class="elementor-column elementor-col-50 elementor-top-column">
                <div class="elementor-widget-wrap">
                  <div class="elementor-element elementor-widget-heading">
                    <h2><b>Come as you are.</b></h2>
                  </div>
                  <div class="elementor-element elementor-widget-heading">
                    <h2>We hold space for your</h2>
                  </div>
                  <div class="elementor-element elementor-widget-heading" id="change">
                    <h2>grief</h2>
                  </div>
                  <div class="elementor-element elementor-widget-text-editor">
                    <p>Oku is a psychotherapy collective offering <strong>inclusive, trauma-informed care</strong> for all parts of who you are. Book a free consultation to begin gently.</p>
                  </div>
                  <div class="elementor-element">
                    <a href="https://wa.me/919953879928?text=Hi%20I%20want%20to%20book%20a%201-1%20session%20with%20you" class="dynamic-button">Book a free 1:1 consultation</a>
                  </div>
                </div>
              </div>
              <div class="elementor-column elementor-col-50 elementor-top-column">
                <!-- Right side illustration placeholder -->
              </div>
            </div>
          </div>
        </div>
        
        <!-- A place to explore Section -->
        <div class="elementor-section elementor-top-section" style="background-color: #faf8f3; padding: 80px 0;">
          <div class="elementor-container elementor-column-gap-default">
            <div class="elementor-row">
              <div class="elementor-column elementor-col-100">
                <div class="elementor-widget-wrap">
                  <div class="elementor-element elementor-widget-heading">
                    <h2>A place to <b>explore</b></h2>
                  </div>
                  <div class="elementor-element elementor-widget-heading">
                    <h3>not perform.</h3>
                  </div>
                </div>
              </div>
            </div>
            <div class="elementor-row" style="margin-top: 40px;">
              <div class="elementor-column elementor-col-33">
                <div class="elementor-widget-wrap">
                  <div class="elementor-element elementor-widget-heading">
                    <h2>Slow</h2>
                  </div>
                  <div class="elementor-element elementor-widget-text-editor">
                    <p>Because healing isn't one-size-fits-all—and it doesn't have to start with words.</p>
                  </div>
                </div>
              </div>
              <div class="elementor-column elementor-col-33">
                <div class="elementor-widget-wrap">
                  <div class="elementor-element elementor-widget-heading">
                    <h2>Deep</h2>
                  </div>
                  <div class="elementor-element elementor-widget-text-editor">
                    <p>We go beyond surface-level solutions to address root causes and patterns.</p>
                  </div>
                </div>
              </div>
              <div class="elementor-column elementor-col-33">
                <div class="elementor-widget-wrap">
                  <div class="elementor-element elementor-widget-heading">
                    <h2>Whole</h2>
                  </div>
                  <div class="elementor-element elementor-widget-text-editor">
                    <p>Your mind, body, emotions, and spirit are all welcome here.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Services Section -->
        <div class="elementor-section elementor-top-section" style="padding: 80px 0;">
          <div class="elementor-container elementor-column-gap-default">
            <div class="elementor-row">
              <div class="elementor-column elementor-col-50">
                <div class="elementor-widget-wrap">
                  <div class="elementor-element elementor-widget-heading">
                    <h2>1. Individual Therapy</h2>
                  </div>
                  <div class="elementor-element elementor-widget-text-editor">
                    <p>One-on-one sessions to explore your thoughts, patterns, and inner world—held with compassion, curiosity, and care.</p>
                  </div>
                  <div class="elementor-element">
                    <a href="https://wa.me/919953879928?text=Hi%20I%20want%20to%20book%20a%201-1%20session%20with%20you" class="dynamic-button">Book a free 1:1 consultation</a>
                  </div>
                </div>
              </div>
              <div class="elementor-column elementor-col-50">
                <div class="elementor-widget-wrap">
                  <div class="elementor-element elementor-widget-heading">
                    <h2>2. Trauma & EMDR</h2>
                  </div>
                  <div class="elementor-element elementor-widget-text-editor">
                    <p>Support for processing trauma—using EMDR and safe practices to help your body and mind rest.</p>
                  </div>
                  <div class="elementor-element">
                    <a href="https://wa.me/919953879928?text=Hi%20I%20want%20to%20book%20a%201-1%20session%20with%20you" class="dynamic-button">Book a free 1:1 consultation</a>
                  </div>
                </div>
              </div>
            </div>
            <div class="elementor-row" style="margin-top: 40px;">
              <div class="elementor-column elementor-col-50">
                <div class="elementor-widget-wrap">
                  <div class="elementor-element elementor-widget-heading">
                    <h2>3. Movement Therapy</h2>
                  </div>
                  <div class="elementor-element elementor-widget-text-editor">
                    <p>When words feel distant, movement speaks. This practice uses breath and flow to reconnect with you.</p>
                  </div>
                  <div class="elementor-element">
                    <a href="https://wa.me/919953879928?text=Hi%20I%20want%20to%20book%20a%201-1%20session%20with%20you" class="dynamic-button">Book a free 1:1 consultation</a>
                  </div>
                </div>
              </div>
              <div class="elementor-column elementor-col-50">
                <div class="elementor-widget-wrap">
                  <div class="elementor-element elementor-widget-heading">
                    <h2>4. Psychometric Assessments</h2>
                  </div>
                  <div class="elementor-element elementor-widget-text-editor">
                    <p>When seeking clarity on patterns or challenges, assessments are done by licensed psychologists—gently and respectfully.</p>
                  </div>
                  <div class="elementor-element">
                    <a href="https://wa.me/919953879928?text=Hi%20I%20want%20to%20book%20a%201-1%20session%20with%20you" class="dynamic-button">Book a free 1:1 consultation</a>
                  </div>
                </div>
              </div>
            </div>
            <div class="elementor-row" style="margin-top: 40px;">
              <div class="elementor-column elementor-col-50">
                <div class="elementor-widget-wrap">
                  <div class="elementor-element elementor-widget-heading">
                    <h2>5. Couples Therapy & Group Work</h2>
                  </div>
                  <div class="elementor-element elementor-widget-text-editor">
                    <p>Healing together in relationships can be transformative, encouraging dialogue and growth.</p>
                  </div>
                  <div class="elementor-element">
                    <a href="https://wa.me/919953879928?text=Hi%20I%20want%20to%20book%20a%201-1%20session%20with%20you" class="dynamic-button">Book a free 1:1 consultation</a>
                  </div>
                </div>
              </div>
              <div class="elementor-column elementor-col-50">
                <div class="elementor-widget-wrap">
                  <div class="elementor-element elementor-widget-heading">
                    <h2>6. Queer-Affirmative Care</h2>
                  </div>
                  <div class="elementor-element elementor-widget-text-editor">
                    <p>Therapy that doesn't require you to explain yourself. We affirm your identity and lived truth—without condition.</p>
                  </div>
                  <div class="elementor-element">
                    <a href="https://wa.me/919953879928?text=Hi%20I%20want%20to%20book%20a%201-1%20session%20with%20you" class="dynamic-button">Book a free 1:1 consultation</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- What shapes our work Section -->
        <div class="elementor-section elementor-top-section" style="background-color: #faf8f3; padding: 80px 0;">
          <div class="elementor-container elementor-column-gap-default">
            <div class="elementor-row">
              <div class="elementor-column elementor-col-100">
                <div class="elementor-widget-wrap">
                  <div class="elementor-element elementor-widget-heading">
                    <h2>What shapes <b>our work,</b></h2>
                  </div>
                  <div class="elementor-element elementor-widget-heading">
                    <h3>and your experience of it.</h3>
                  </div>
                </div>
              </div>
            </div>
            <div class="elementor-row" style="margin-top: 40px;">
              <div class="elementor-column elementor-col-33">
                <div class="elementor-widget-wrap">
                  <div class="elementor-element elementor-widget-text-editor">
                    <h4>Care Over Fixing</h4>
                    <p>We believe in holding space rather than rushing solutions. Your journey unfolds at its own pace.</p>
                  </div>
                </div>
              </div>
              <div class="elementor-column elementor-col-33">
                <div class="elementor-widget-wrap">
                  <div class="elementor-element elementor-widget-text-editor">
                    <h4>Inclusive By Design</h4>
                    <p>Every part of you is welcome here. No code-switching, no explaining—just authentic connection.</p>
                  </div>
                </div>
              </div>
              <div class="elementor-column elementor-col-33">
                <div class="elementor-widget-wrap">
                  <div class="elementor-element elementor-widget-text-editor">
                    <h4>Not Quick Wins</h4>
                    <p>Deep healing takes time. We're here for the long haul, not the quick fix.</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="elementor-row" style="margin-top: 60px; text-align: center;">
              <div class="elementor-column elementor-col-100">
                <div class="elementor-widget-wrap">
                  <div class="elementor-element elementor-widget-heading">
                    <h2>Not sure where to <b>begin?</b></h2>
                  </div>
                  <div class="elementor-element elementor-widget-text-editor">
                    <p>Our free 20-minute consultation is a space to ask questions, feel things out, and see if we're the right fit—no pressure, no prep needed.</p>
                  </div>
                  <div class="elementor-element">
                    <a href="https://wa.me/919953879928?text=Hi%20I%20want%20to%20book%20a%201-1%20session%20with%20you" class="dynamic-button">Book a free 1:1 consultation</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `
    }} />
  )
}
