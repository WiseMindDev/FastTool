(function () {
  // Define ParticleNetworkAnimation constructor
  var ParticleNetworkAnimation = function () {
    // Constructor can be empty as init handles setup, or add properties if needed
  };

  // Assign PNA as an alias for ParticleNetworkAnimation
  var PNA = ParticleNetworkAnimation;

  /**
   * Initializes the Particle Network Animation.
   * @param {HTMLElement} element - The DOM element to append the canvas to.
   */
  PNA.prototype.init = function (element) {
    this.$el = $(element); // jQuery element reference

    this.container = element; // Native DOM element reference
    this.canvas = document.createElement("canvas"); // Create the canvas element
    this.sizeCanvas(); // Set initial canvas size
    this.container.appendChild(this.canvas); // Append canvas to the container
    this.ctx = this.canvas.getContext("2d"); // Get 2D rendering context

    // Initialize the ParticleNetwork logic
    this.particleNetwork = new ParticleNetwork(this);

    this.bindUiActions(); // Bind UI event listeners

    return this; // Return instance for chaining
  };

  /**
   * Binds UI event listeners (e.g., window resize).
   */
  PNA.prototype.bindUiActions = function () {
    // Bind resize event to re-size canvas and re-create particles
    $(window).on(
      "resize",
      function () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Clear canvas
        this.sizeCanvas(); // Re-size canvas
        this.particleNetwork.createParticles(); // Re-create particles for new size
      }.bind(this) // Ensure 'this' context is preserved
    );
  };

  /**
   * Sets the canvas width and height to match its container.
   */
  PNA.prototype.sizeCanvas = function () {
    this.canvas.width = this.container.offsetWidth;
    this.canvas.height = this.container.offsetHeight;
  };

  /**
   * Represents a single particle in the network.
   * @param {ParticleNetwork} parent - The parent ParticleNetwork instance.
   * @param {number} [x] - Initial x-coordinate (random if not provided).
   * @param {number} [y] - Initial y-coordinate (random if not provided).
   */
  var Particle = function (parent, x, y) {
    this.network = parent; // Reference to the parent network
    this.canvas = parent.canvas;
    this.ctx = parent.ctx;
    this.particleColor = returnRandomArrayitem(
      this.network.options.particleColors
    ); // Random color from options
    this.radius = getLimitedRandom(1.5, 2.5); // Random radius
    this.opacity = 0; // Initial opacity for fade-in effect
    this.x = x || Math.random() * this.canvas.width; // Initial x-position
    this.y = y || Math.random() * this.canvas.height; // Initial y-position
    this.velocity = {
      x: (Math.random() - 0.5) * parent.options.velocity, // Random x-velocity
      y: (Math.random() - 0.5) * parent.options.velocity, // Random y-velocity
    };
  };

  /**
   * Updates the particle's position and opacity.
   */
  Particle.prototype.update = function () {
    // Fade in the particle
    if (this.opacity < 1) {
      this.opacity += 0.01;
    } else {
      this.opacity = 1;
    }

    // Reverse velocity if particle goes out of bounds (with a buffer)
    if (this.x > this.canvas.width + 100 || this.x < -100) {
      this.velocity.x = -this.velocity.x;
    }
    if (this.y > this.canvas.height + 100 || this.y < -100) {
      this.velocity.y = -this.velocity.y;
    }

    // Update position based on velocity
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  };

  /**
   * Draws the particle on the canvas.
   */
  Particle.prototype.draw = function () {
    this.ctx.beginPath(); // Start a new path
    this.ctx.fillStyle = this.particleColor; // Set fill color
    this.ctx.globalAlpha = this.opacity; // Set global alpha for transparency
    this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI); // Draw circle
    this.ctx.fill(); // Fill the circle
  };

  /**
   * Manages the collection of particles and their interactions (lines).
   * @param {PNA} parent - The parent ParticleNetworkAnimation instance.
   */
  var ParticleNetwork = function (parent) {
    this.options = {
      velocity: 1, // Speed of particles (the higher the faster)
      density: 15000, // Density of particles (the lower the denser)
      netLineDistance: 200, // Max distance for lines between particles
      netLineColor: "#929292", // Color of the connecting lines
      particleColors: ["#aaa", "#6D4E5C", "#FFC458"], // Array of possible particle colors
    };
    this.canvas = parent.canvas;
    this.ctx = parent.ctx;
    this.particles = []; // Array to hold particle objects
    this.interactionParticle = undefined; // Particle for mouse/touch interaction

    this.init(); // Initialize the network
  };

  /**
   * Initializes the particle network.
   */
  ParticleNetwork.prototype.init = function () {
    this.createParticles(true); // Create initial particles with fade-in

    // Start the animation loop
    this.animationFrame = requestAnimationFrame(this.update.bind(this));

    this.bindUiActions(); // Bind mouse/touch event listeners
  };

  /**
   * Creates particles for the network.
   * @param {boolean} isInitial - True if this is the initial creation (for fade-in effect).
   */
  ParticleNetwork.prototype.createParticles = function (isInitial) {
    var me = this;
    this.particles = []; // Clear existing particles
    // Calculate quantity based on canvas size and density option
    var quantity =
      (this.canvas.width * this.canvas.height) / this.options.density;

    if (isInitial) {
      var counter = 0;
      clearInterval(this.createIntervalId); // Clear any previous interval
      // Gradually add particles for a smoother initial appearance
      this.createIntervalId = setInterval(
        function () {
          if (counter < quantity - 1) {
            this.particles.push(new Particle(this));
          } else {
            clearInterval(me.createIntervalId); // Stop interval when all particles are added
          }
          counter++;
        }.bind(this),
        250 // Add a particle every 250ms
      );
    } else {
      // Immediately add all particles if not initial creation (e.g., on resize)
      for (var i = 0; i < quantity; i++) {
        this.particles.push(new Particle(this));
      }
    }
  };

  /**
   * Creates a special particle that follows mouse/touch for interaction.
   * @returns {Particle} The interaction particle.
   */
  ParticleNetwork.prototype.createInteractionParticle = function () {
    this.interactionParticle = new Particle(this);
    this.interactionParticle.velocity = { x: 0, y: 0 }; // No inherent movement
    this.particles.push(this.interactionParticle); // Add to the particles array
    return this.interactionParticle;
  };

  /**
   * Removes the interaction particle from the network.
   */
  ParticleNetwork.prototype.removeInteractionParticle = function () {
    var index = this.particles.indexOf(this.interactionParticle);
    if (index > -1) {
      this.interactionParticle = undefined; // Clear reference
      this.particles.splice(index, 1); // Remove from array
    }
  };

  /**
   * The main animation update loop. Clears canvas, draws lines, updates and draws particles.
   */
  ParticleNetwork.prototype.update = function () {
    if (this.canvas) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Clear entire canvas
      this.ctx.globalAlpha = 1; // Reset global alpha

      // Draw connections between particles
      for (var i = 0; i < this.particles.length; i++) {
        for (var j = this.particles.length - 1; j > i; j--) {
          var distance,
            p1 = this.particles[i],
            p2 = this.particles[j];

          // Quick check: if difference in x or y is already too large, skip precise calculation
          distance = Math.min(Math.abs(p1.x - p2.x), Math.abs(p1.y - p2.y));
          if (distance > this.options.netLineDistance) {
            continue;
          }

          // Precise distance calculation (Euclidean distance)
          distance = Math.sqrt(
            Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)
          );
          if (distance > this.options.netLineDistance) {
            continue;
          }

          // Draw the line
          this.ctx.beginPath();
          this.ctx.strokeStyle = this.options.netLineColor;
          // Line opacity based on distance and particle opacities
          this.ctx.globalAlpha =
            ((this.options.netLineDistance - distance) /
              this.options.netLineDistance) *
            p1.opacity *
            p2.opacity;
          this.ctx.lineWidth = 0.7;
          this.ctx.moveTo(p1.x, p1.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.stroke();
        }
      }

      // Update and draw all particles
      for (var i = 0; i < this.particles.length; i++) {
        this.particles[i].update();
        this.particles[i].draw();
      }

      // Continue animation if velocity is not zero (i.e., animation is active)
      if (this.options.velocity !== 0) {
        this.animationFrame = requestAnimationFrame(this.update.bind(this));
      }
    } else {
      // If canvas no longer exists, cancel the animation frame
      cancelAnimationFrame(this.animationFrame);
    }
  };

  /**
   * Binds mouse and touch event listeners for interaction.
   */
  ParticleNetwork.prototype.bindUiActions = function () {
    this.spawnQuantity = 3; // Number of particles to spawn on click/tap
    this.mouseIsDown = false;
    this.touchIsMoving = false;

    // Event handler for mouse movement
    this.onMouseMove = function (e) {
      if (!this.interactionParticle) {
        this.createInteractionParticle();
      }
      this.interactionParticle.x = e.offsetX;
      this.interactionParticle.y = e.offsetY;
    }.bind(this);

    // Event handler for touch movement
    this.onTouchMove = function (e) {
      e.preventDefault(); // Prevent scrolling
      this.touchIsMoving = true;
      if (!this.interactionParticle) {
        this.createInteractionParticle();
      }
      this.interactionParticle.x = e.changedTouches[0].clientX;
      this.interactionParticle.y = e.changedTouches[0].clientY;
    }.bind(this);

    // Event handler for mouse down
    this.onMouseDown = function (e) {
      this.mouseIsDown = true;
      var counter = 0;
      var quantity = this.spawnQuantity;
      // Spawn particles at intervals while mouse is down
      var intervalId = setInterval(
        function () {
          if (this.mouseIsDown) {
            if (counter === 1) {
              quantity = 1; // After the first burst, spawn one by one
            }
            for (var i = 0; i < quantity; i++) {
              if (this.interactionParticle) {
                this.particles.push(
                  new Particle(
                    this,
                    this.interactionParticle.x,
                    this.interactionParticle.y
                  )
                );
              }
            }
          } else {
            clearInterval(intervalId); // Stop spawning when mouse is up
          }
          counter++;
        }.bind(this),
        50 // Spawn every 50ms
      );
    }.bind(this);

    // Event handler for touch start
    this.onTouchStart = function (e) {
      e.preventDefault(); // Prevent default touch behavior (e.g., zoom)
      setTimeout(
        function () {
          // Only spawn if touch wasn't a move (i.e., a tap)
          if (!this.touchIsMoving) {
            for (var i = 0; i < this.spawnQuantity; i++) {
              this.particles.push(
                new Particle(
                  this,
                  e.changedTouches[0].clientX,
                  e.changedTouches[0].clientY
                )
              );
            }
          }
        }.bind(this),
        200 // Delay to differentiate tap from scroll
      );
    }.bind(this);

    // Event handler for mouse up
    this.onMouseUp = function (e) {
      this.mouseIsDown = false;
    }.bind(this);

    // Event handler for mouse out of canvas
    this.onMouseOut = function (e) {
      this.removeInteractionParticle();
    }.bind(this);

    // Event handler for touch end
    this.onTouchEnd = function (e) {
      e.preventDefault(); // Prevent default touch behavior
      this.touchIsMoving = false;
      this.removeInteractionParticle();
    }.bind(this);

    // Add event listeners to the canvas
    this.canvas.addEventListener("mousemove", this.onMouseMove);
    this.canvas.addEventListener("touchmove", this.onTouchMove);
    this.canvas.addEventListener("mousedown", this.onMouseDown);
    this.canvas.addEventListener("touchstart", this.onTouchStart);
    this.canvas.addEventListener("mouseup", this.onMouseUp);
    this.canvas.addEventListener("mouseout", this.onMouseOut);
    this.canvas.addEventListener("touchend", this.onTouchEnd);
  };

  /**
   * Unbinds all UI event listeners.
   */
  ParticleNetwork.prototype.unbindUiActions = function () {
    if (this.canvas) {
      this.canvas.removeEventListener("mousemove", this.onMouseMove);
      this.canvas.removeEventListener("touchmove", this.onTouchMove);
      this.canvas.removeEventListener("mousedown", this.onMouseDown);
      this.canvas.removeEventListener("touchstart", this.onTouchStart);
      this.canvas.removeEventListener("mouseup", this.onMouseUp);
      this.canvas.removeEventListener("mouseout", this.onMouseOut);
      this.canvas.removeEventListener("touchend", this.onTouchEnd);
    }
  };

  /**
   * Generates a random number within a specified range.
   * @param {number} min - The minimum value.
   * @param {number} max - The maximum value.
   * @param {boolean} roundToInteger - If true, rounds the number to the nearest integer.
   * @returns {number} The random number.
   */
  var getLimitedRandom = function (min, max, roundToInteger) {
    var number = Math.random() * (max - min) + min;
    if (roundToInteger) {
      number = Math.round(number);
    }
    return number;
  };

  /**
   * Returns a random item from an array.
   * @param {Array} array - The array to pick from.
   * @returns {*} A random item from the array.
   */
  var returnRandomArrayitem = function (array) {
    return array[Math.floor(Math.random() * array.length)];
  };

  // Initialize the animation when the window loads
  window.onload = function () {
    // Create a new instance of the animation and initialize it with the target element
    var pnaInstance = new PNA();
    pnaInstance.init($(".particle-network-animation")[0]);
  };
})();
