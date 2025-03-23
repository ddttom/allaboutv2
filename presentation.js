// Configuration
const PRESENTATION_CONFIG = {
  TIMER_INTERVAL_MS: 1000,
  TIMER_START_TEXT: 'Start Timer',
  TIMER_PAUSE_TEXT: 'Pause Timer',
  TIMER_RESET_TEXT: 'Reset Timer'
};

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const timerBtn = document.getElementById('timer-btn');
  const slides = document.querySelectorAll('.slide');
  
  // Create footer if it doesn't exist
  let footer = document.querySelector('.footer');
  if (!footer) {
    const container = document.querySelector('.container');
    footer = document.createElement('div');
    footer.className = 'footer';
    footer.innerHTML = `
      <div class="timer">00:00</div>
      <div class="pagination">Slide <span id="current-slide">1</span> of <span id="total-slides">${slides.length}</span></div>
    `;
    container.appendChild(footer);
  }
  
  const timerDisplay = document.querySelector('.timer');
  const currentSlideDisplay = document.getElementById('current-slide');
  
  // State variables
  let currentSlideIndex = 0;
  let timerInterval = null;
  let seconds = 0;
  let timerRunning = false;
  
  // Initialize the presentation
  function initPresentation() {
    // Set total slides count
    document.getElementById('total-slides').textContent = slides.length;
    
    // Add event listeners to buttons
    prevBtn.addEventListener('click', goToPreviousSlide);
    nextBtn.addEventListener('click', goToNextSlide);
    timerBtn.addEventListener('click', toggleTimer);
    
    // Set initial slide
    updateSlideDisplay();
  }
  
  // Navigate to the previous slide
  function goToPreviousSlide() {
    if (currentSlideIndex > 0) {
      slides[currentSlideIndex].classList.remove('active');
      currentSlideIndex--;
      slides[currentSlideIndex].classList.add('active');
      updateSlideDisplay();
    }
  }
  
  // Navigate to the next slide
  function goToNextSlide() {
    if (currentSlideIndex < slides.length - 1) {
      slides[currentSlideIndex].classList.remove('active');
      currentSlideIndex++;
      slides[currentSlideIndex].classList.add('active');
      updateSlideDisplay();
    }
  }
  
  // Update the slide display and button states
  function updateSlideDisplay() {
    // Update current slide number
    currentSlideDisplay.textContent = currentSlideIndex + 1;
    
    // Update button states
    prevBtn.disabled = currentSlideIndex === 0;
    nextBtn.disabled = currentSlideIndex === slides.length - 1;
  }
  
  // Toggle the timer (start/pause/reset)
  function toggleTimer() {
    if (!timerRunning) {
      // Start the timer
      timerRunning = true;
      timerBtn.textContent = PRESENTATION_CONFIG.TIMER_PAUSE_TEXT;
      timerInterval = setInterval(updateTimer, PRESENTATION_CONFIG.TIMER_INTERVAL_MS);
    } else {
      // Pause the timer
      timerRunning = false;
      timerBtn.textContent = PRESENTATION_CONFIG.TIMER_RESET_TEXT;
      clearInterval(timerInterval);
    }
  }
  
  // Reset the timer
  function resetTimer() {
    clearInterval(timerInterval);
    seconds = 0;
    timerRunning = false;
    timerBtn.textContent = PRESENTATION_CONFIG.TIMER_START_TEXT;
    updateTimerDisplay();
  }
  
  // Update the timer display
  function updateTimer() {
    seconds++;
    updateTimerDisplay();
  }
  
  // Format and display the timer
  function updateTimerDisplay() {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  
  // Handle timer button double click for reset
  timerBtn.addEventListener('dblclick', resetTimer);
  
  // Initialize the presentation
  initPresentation();
});