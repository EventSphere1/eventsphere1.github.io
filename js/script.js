// =============================================
// EventSphere
// Tickets Page
// Version 1.4
//
// Functionality:
// - Ticket quantity controls
// - Minimum quantity: 0
// - Maximum quantity: 10
// - Ticket subtotal calculation
// - Booking fee calculation
// - Final total calculation
// - Enable or disable Continue
// - Move from Tickets to Booking Details
// - Return from Details to Tickets
// - Update the five-step progress indicator
// - Display selected tickets in Step 2
//
// Planned Version 1.5:
// - Validate customer details
// - Check matching email addresses
// - Display Review Booking step
// =============================================


"use strict";


document.addEventListener(
    "DOMContentLoaded",
    function () {

		// =====================================
		// Back to Top Button
		// =====================================

		const backToTopButton =
			document.getElementById(
				"backToTopButton"
			);


		if (backToTopButton) {

			// Show the button after the visitor
			// has scrolled down the page.

			window.addEventListener(
				"scroll",
				function () {

					if (window.scrollY > 150) {

						backToTopButton.classList.add(
							"show"
						);

					} else {

						backToTopButton.classList.remove(
							"show"
						);

					}

				}
			);


			// Smoothly return to the top.

			backToTopButton.addEventListener(
				"click",
				function () {

					window.scrollTo({
						top: 0,
						behavior: "smooth"
					});

				}
			);

		}

        // =====================================
        // Check Whether This Is Tickets Page
        // =====================================

        const ticketOptions =
            document.querySelectorAll(".ticket-option");


        // The shared script is also loaded by
        // Home and Events. Stop here when the
        // ticket controls are not present.

        if (ticketOptions.length === 0) {

            return;

        }


        // =====================================
        // Constants
        // =====================================

        const maxTickets = 10;

        const bookingFeePerTicket = 2.50;


        // =====================================
        // Ticket Summary Elements
        // =====================================

        const totalTicketsDisplay =
            document.getElementById("totalTickets");

        const subtotalDisplay =
            document.getElementById("subtotal");

        const bookingFeeDisplay =
            document.getElementById("bookingFee");

        const totalPriceDisplay =
            document.getElementById("totalPrice");

        const continueButton =
            document.getElementById("continueButton");


        // =====================================
        // Page-Step Elements
        // =====================================

        const ticketSelectionStep =
            document.getElementById("ticketSelectionStep");

        const bookingDetailsStep =
            document.getElementById("bookingDetailsStep");

        const backToTicketsButton =
            document.getElementById("backToTicketsButton");

        const progressSteps =
            document.querySelectorAll(".progress-step");
		
		
		// =====================================
		// Review Booking - Step 3 Elements
		// =====================================

		const reviewBookingStep =
			document.getElementById("reviewBookingStep");

		const backToDetailsButton =
			document.getElementById("backToDetailsButton");

		const confirmBookingButton =
			document.getElementById("confirmBookingButton");


		// Review ticket information

		const reviewTicketBreakdown =
			document.getElementById("reviewTicketBreakdown");

		const reviewTicketCountBadge =
			document.getElementById("reviewTicketCountBadge");

		const reviewTotalTickets =
			document.getElementById("reviewTotalTickets");

		const reviewSubtotal =
			document.getElementById("reviewSubtotal");

		const reviewBookingFee =
			document.getElementById("reviewBookingFee");

		const reviewTotalPrice =
			document.getElementById("reviewTotalPrice");


		// Review customer information

		const reviewCustomerName =
			document.getElementById("reviewCustomerName");

		const reviewCustomerEmail =
			document.getElementById("reviewCustomerEmail");

		const reviewCustomerPhone =
			document.getElementById("reviewCustomerPhone");
		

		// =====================================
		// Booking Confirmed - Step 4 Elements
		// =====================================

		const bookingConfirmedStep =
			document.getElementById(
				"bookingConfirmedStep"
			);

		const confirmedBookingReference =
			document.getElementById(
				"confirmedBookingReference"
			);

		const confirmedCustomerName =
			document.getElementById(
				"confirmedCustomerName"
			);

		const confirmedTicketCount =
			document.getElementById(
				"confirmedTicketCount"
			);

		const confirmedTotalPrice =
			document.getElementById(
				"confirmedTotalPrice"
			);

		const confirmedTicketBreakdown =
			document.getElementById(
				"confirmedTicketBreakdown"
			);

		const generateTicketButton =
			document.getElementById(
				"generateTicketButton"
			);
			
		
		
		// =====================================
		// Facsimile Ticket - Step 5 Elements
		// =====================================

		const facsimileTicketStep =
			document.getElementById(
				"facsimileTicketStep"
			);


		const generatedTickets =
			document.getElementById(
				"generatedTickets"
			);


		const printTicketsButton =
			document.getElementById(
				"printTicketsButton"
			);


		const backToConfirmationButton =
			document.getElementById(
				"backToConfirmationButton"
			);
			
		const ticketEmailAddress =
			document.getElementById(
				"ticketEmailAddress"
			);

		
		
		
			
			
		// =====================================
		// Booking Details Form Elements
		// =====================================

		const bookingDetailsForm =
			document.getElementById("bookingDetailsForm");

		const customerName =
			document.getElementById("customerName");

		const customerEmail =
			document.getElementById("customerEmail");

		const confirmEmail =
			document.getElementById("confirmEmail");

		const customerPhone =
			document.getElementById("customerPhone");

		const reviewBookingButton =
			document.getElementById("reviewBookingButton");


		// Error-message elements

		const customerNameError =
			document.getElementById("customerNameError");

		const customerEmailError =
			document.getElementById("customerEmailError");

		const confirmEmailError =
			document.getElementById("confirmEmailError");

		const customerPhoneError =
			document.getElementById("customerPhoneError");


		// Validation patterns adapted from CA1

		const emailPattern =
			/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

		const phonePattern =
			/^\+[0-9\s]{7,20}$/;


        // =====================================
        // Details Summary Elements
        // =====================================

        const detailsTicketBreakdown =
            document.getElementById("detailsTicketBreakdown");

        const detailsTotalTickets =
            document.getElementById("detailsTotalTickets");

        const detailsSubtotal =
            document.getElementById("detailsSubtotal");

        const detailsBookingFee =
            document.getElementById("detailsBookingFee");

        const detailsTotalPrice =
            document.getElementById("detailsTotalPrice");


        // =====================================
        // Order State
        // =====================================

        let currentTotalTickets = 0;
        let currentSubtotal = 0;
        let currentBookingFee = 0;
        let currentTotalPrice = 0;
		
		// The reference is created only once
		// when the booking is confirmed.
		let currentBookingReference = "";


        // =====================================
        // Currency Formatting
        // =====================================

        function formatCurrency(amount) {

            return "€" + amount.toFixed(2);

        }
		
		// =====================================
		// Generate Demonstration Reference
		// =====================================

		function generateBookingReference() {

			const randomNumber =
				Math.floor(
					100000 +
					Math.random() * 900000
				);


			return "ES-2026-" + randomNumber;

		}


        // =====================================
        // Update Order Summary
        // =====================================

        function updateOrderSummary() {

            let totalTickets = 0;
            let subtotal = 0;


            ticketOptions.forEach(
                function (ticketOption) {

                    const ticketPrice =
                        Number(ticketOption.dataset.price);

                    const quantityDisplay =
                        ticketOption.querySelector(
                            ".quantity-value"
                        );

                    const quantity =
                        Number(
                            quantityDisplay.textContent
                        );


                    totalTickets =
                        totalTickets + quantity;


                    subtotal =
                        subtotal +
                        (ticketPrice * quantity);

                }
            );


            const bookingFee =
                totalTickets *
                bookingFeePerTicket;


            const totalPrice =
                subtotal +
                bookingFee;


            // Store current order totals.

            currentTotalTickets =
                totalTickets;

            currentSubtotal =
                subtotal;

            currentBookingFee =
                bookingFee;

            currentTotalPrice =
                totalPrice;


            // Update Step 1 summary.

            totalTicketsDisplay.textContent =
                totalTickets;

            subtotalDisplay.textContent =
                formatCurrency(subtotal);

            bookingFeeDisplay.textContent =
                formatCurrency(bookingFee);

            totalPriceDisplay.textContent =
                formatCurrency(totalPrice);


            // Enable Continue only when at least
            // one ticket has been selected.

            continueButton.disabled =
                totalTickets === 0;

        }


        // =====================================
        // Update Details Summary
        // =====================================

        function updateDetailsSummary() {

            detailsTicketBreakdown.innerHTML =
                "";


            ticketOptions.forEach(
                function (ticketOption) {

                    const ticketType =
                        ticketOption.dataset.ticketType;

                    const ticketPrice =
                        Number(
                            ticketOption.dataset.price
                        );

                    const quantity =
                        Number(
                            ticketOption.querySelector(
                                ".quantity-value"
                            ).textContent
                        );


                    // Only show ticket types that
                    // have been selected.

                    if (quantity > 0) {

                        const ticketTotal =
                            ticketPrice * quantity;


                        const ticketRow =
                            document.createElement("div");


                        ticketRow.className =
                            "details-ticket-row";


                        ticketRow.innerHTML =
                            "<span>" +
                            ticketType +
                            " × " +
                            quantity +
                            "</span>" +
                            "<strong>" +
                            formatCurrency(ticketTotal) +
                            "</strong>";


                        detailsTicketBreakdown.appendChild(
                            ticketRow
                        );

                    }

                }
            );


            detailsTotalTickets.textContent =
                currentTotalTickets;

            detailsSubtotal.textContent =
                formatCurrency(currentSubtotal);

            detailsBookingFee.textContent =
                formatCurrency(currentBookingFee);

            detailsTotalPrice.textContent =
                formatCurrency(currentTotalPrice);

        }
		
		
		
		// =====================================
		// Update Review Booking Screen
		// =====================================

		function updateReviewSummary() {

			// Clear any old ticket rows.

			reviewTicketBreakdown.innerHTML =
				"";


			// Create the selected ticket rows.

			ticketOptions.forEach(
				function (ticketOption) {

					const ticketType =
						ticketOption.dataset.ticketType;

					const ticketPrice =
						Number(
							ticketOption.dataset.price
						);

					const quantity =
						Number(
							ticketOption.querySelector(
								".quantity-value"
							).textContent
						);


					if (quantity > 0) {

						const ticketTotal =
							ticketPrice * quantity;


						const ticketRow =
							document.createElement("div");


						ticketRow.className =
							"review-ticket-row";


						const ticketInformation =
							document.createElement("div");


						ticketInformation.className =
							"review-ticket-information";


						const ticketHeading =
							document.createElement("h4");


						ticketHeading.textContent =
							ticketType + " Admission";


						const ticketCalculation =
							document.createElement("p");


						ticketCalculation.textContent =
							quantity +
							" × " +
							formatCurrency(ticketPrice);


						const ticketTotalDisplay =
							document.createElement("span");


						ticketTotalDisplay.className =
							"review-ticket-price";


						ticketTotalDisplay.textContent =
							formatCurrency(ticketTotal);


						ticketInformation.appendChild(
							ticketHeading
						);


						ticketInformation.appendChild(
							ticketCalculation
						);


						ticketRow.appendChild(
							ticketInformation
						);


						ticketRow.appendChild(
							ticketTotalDisplay
						);


						reviewTicketBreakdown.appendChild(
							ticketRow
						);

					}

				}
			);


			// Update order totals.

			reviewTotalTickets.textContent =
				currentTotalTickets;


			reviewSubtotal.textContent =
				formatCurrency(currentSubtotal);


			reviewBookingFee.textContent =
				formatCurrency(currentBookingFee);


			reviewTotalPrice.textContent =
				formatCurrency(currentTotalPrice);


			// Update ticket-count badge.

			if (currentTotalTickets === 1) {

				reviewTicketCountBadge.textContent =
					"1 ticket";

			} else {

				reviewTicketCountBadge.textContent =
					currentTotalTickets + " tickets";

			}


			// Update customer details.

			reviewCustomerName.textContent =
				customerName.value.trim();


			reviewCustomerEmail.textContent =
				customerEmail.value.trim();


			const phoneValue =
				customerPhone.value.trim();


			if (phoneValue) {

				reviewCustomerPhone.textContent =
					phoneValue;

			} else {

				reviewCustomerPhone.textContent =
					"Not provided";

			}

		}
		
		
		// =====================================
		// Update Booking Confirmation
		// =====================================

		function updateConfirmationSummary() {

			// Generate the reference only once.

			if (!currentBookingReference) {

				currentBookingReference =
					generateBookingReference();

			}


			confirmedBookingReference.textContent =
				currentBookingReference;


			confirmedCustomerName.textContent =
				customerName.value.trim();


			confirmedTicketCount.textContent =
				currentTotalTickets;


			confirmedTotalPrice.textContent =
				formatCurrency(currentTotalPrice);


			// Clear previous ticket rows.

			confirmedTicketBreakdown.innerHTML =
				"";


			// Build confirmed ticket rows.

			ticketOptions.forEach(
				function (ticketOption) {

					const ticketType =
						ticketOption.dataset.ticketType;

					const ticketPrice =
						Number(
							ticketOption.dataset.price
						);

					const quantity =
						Number(
							ticketOption.querySelector(
								".quantity-value"
							).textContent
						);


					if (quantity > 0) {

						const ticketTotal =
							ticketPrice * quantity;


						const ticketRow =
							document.createElement("div");


						ticketRow.className =
							"confirmed-ticket-row";


						const ticketDescription =
							document.createElement("span");


						ticketDescription.textContent =
							ticketType +
							" × " +
							quantity;


						const ticketPriceDisplay =
							document.createElement("strong");


						ticketPriceDisplay.textContent =
							formatCurrency(ticketTotal);


						ticketRow.appendChild(
							ticketDescription
						);


						ticketRow.appendChild(
							ticketPriceDisplay
						);


						confirmedTicketBreakdown.appendChild(
							ticketRow
						);

					}

				}
			);

		}
		
		
		
		// =====================================
		// Create Ticket Information Item
		// =====================================

		function createTicketInformationItem(
			label,
			value
		) {

			const item =
				document.createElement("div");


			item.className =
				"ticket-information-item";


			const itemLabel =
				document.createElement("span");


			itemLabel.textContent =
				label;


			const itemValue =
				document.createElement("strong");


			itemValue.textContent =
				value;


			item.appendChild(
				itemLabel
			);


			item.appendChild(
				itemValue
			);


			return item;

		}
		
		
		// =====================================
		// Generate Individual Facsimile Tickets
		// =====================================

		function generateFacsimileTickets() {

			// Remove any tickets generated earlier.

			generatedTickets.innerHTML =
				"";


			// Keeps track of the overall ticket number.

			let ticketPosition =
				0;


			// Check each ticket type:
			// Standard, Premium and VIP.

			ticketOptions.forEach(
				function (ticketOption) {

					const ticketType =
						ticketOption.dataset.ticketType;


					const ticketPrice =
						Number(
							ticketOption.dataset.price
						);


					const quantity =
						Number(
							ticketOption.querySelector(
								".quantity-value"
							).textContent
						);


					// Create one ticket for every
					// admission selected.

					for (
						let ticketNumber = 1;
						ticketNumber <= quantity;
						ticketNumber++
					) {

						ticketPosition++;


						// Example:
						// ES-2026-123456-01

						const ticketId =
							currentBookingReference +
							"-" +
							String(ticketPosition).padStart(
								2,
								"0"
							);


						// =================================
						// Create Ticket
						// =================================

						const ticket =
							document.createElement("article");


						ticket.className =
							"facsimile-ticket";


						ticket.setAttribute(
							"aria-label",
							ticketType +
							" facsimile ticket for Sample Event"
						);


						// =================================
						// Main Ticket Section
						// =================================

						const mainContent =
							document.createElement("div");


						mainContent.className =
							"ticket-main-content";


						// =================================
						// Logo and Ticket Position
						// =================================

						const brandRow =
							document.createElement("div");


						brandRow.className =
							"ticket-brand-row";


						const logo =
							document.createElement("img");


						logo.src =
							"../images/logo.png";


						logo.alt =
							"EventSphere ticketing platform logo";


						logo.className =
							"ticket-logo";


						const positionDisplay =
							document.createElement("span");


						positionDisplay.className =
							"ticket-position";


						positionDisplay.textContent =
							"Ticket " +
							ticketPosition +
							" of " +
							currentTotalTickets;


						brandRow.appendChild(
							logo
						);


						brandRow.appendChild(
							positionDisplay
						);


						// =================================
						// Event Name
						// =================================

						const eventLabel =
							document.createElement("p");


						eventLabel.className =
							"ticket-event-label";


						eventLabel.textContent =
							"EVENT";


						const eventName =
							document.createElement("h3");


						eventName.className =
							"ticket-event-name";


						eventName.textContent =
							"Sample Event";


						// =================================
						// Event Information
						// =================================

						const informationGrid =
							document.createElement("div");


						informationGrid.className =
							"ticket-information-grid";


						informationGrid.appendChild(
							createTicketInformationItem(
								"Date",
								"Saturday, 12 December 2026"
							)
						);


						informationGrid.appendChild(
							createTicketInformationItem(
								"Time",
								"19:30"
							)
						);


						informationGrid.appendChild(
							createTicketInformationItem(
								"Venue",
								"Sample Arena, Dublin"
							)
						);


						// =================================
						// Ticket Holder and Reference
						// =================================

						const holderRow =
							document.createElement("div");


						holderRow.className =
							"ticket-holder-row";


						holderRow.appendChild(
							createTicketInformationItem(
								"Ticket holder",
								customerName.value.trim()
							)
						);


						holderRow.appendChild(
							createTicketInformationItem(
								"Booking reference",
								currentBookingReference
							)
						);


						// Assemble main section.

						mainContent.appendChild(
							brandRow
						);


						mainContent.appendChild(
							eventLabel
						);


						mainContent.appendChild(
							eventName
						);


						mainContent.appendChild(
							informationGrid
						);


						mainContent.appendChild(
							holderRow
						);


						// =================================
						// Ticket Stub
						// =================================

						const stub =
							document.createElement("div");


						stub.className =
							"ticket-stub";


						const stubTop =
							document.createElement("div");


						const facsimileLabel =
							document.createElement("div");


						facsimileLabel.className =
							"facsimile-label";


						facsimileLabel.textContent =
							"FACSIMILE TICKET";


						const ticketTypeDisplay =
							document.createElement("div");


						ticketTypeDisplay.className =
							"ticket-type-name";


						ticketTypeDisplay.textContent =
							ticketType +
							" Admission";


						const ticketPriceDisplay =
							document.createElement("div");


						ticketPriceDisplay.className =
							"ticket-price";


						ticketPriceDisplay.textContent =
							formatCurrency(ticketPrice);


						stubTop.appendChild(
							facsimileLabel
						);


						stubTop.appendChild(
							ticketTypeDisplay
						);


						stubTop.appendChild(
							ticketPriceDisplay
						);


						// =================================
						// Decorative Barcode and Ticket ID
						// =================================

						const stubBottom =
							document.createElement("div");


						const barcode =
							document.createElement("div");


						barcode.className =
							"ticket-barcode";


						// Decorative only.
						// Screen readers can ignore it.

						barcode.setAttribute(
							"aria-hidden",
							"true"
						);


						const ticketIdDisplay =
							document.createElement("div");


						ticketIdDisplay.className =
							"ticket-id";


						ticketIdDisplay.textContent =
							ticketId;


						// =================================
						// Facsimile Warning
						// =================================

						const facsimileStamp =
							document.createElement("div");


						facsimileStamp.className =
							"ticket-facsimile-stamp";


						facsimileStamp.textContent =
							"NOT VALID FOR ADMISSION";


						stubBottom.appendChild(
							barcode
						);


						stubBottom.appendChild(
							ticketIdDisplay
						);


						stubBottom.appendChild(
							facsimileStamp
						);


						stub.appendChild(
							stubTop
						);


						stub.appendChild(
							stubBottom
						);


						// =================================
						// Complete the Ticket
						// =================================

						ticket.appendChild(
							mainContent
						);


						ticket.appendChild(
							stub
						);


						generatedTickets.appendChild(
							ticket
						);

					}

				}
			);

		}


        // =====================================
        // Update Progress Indicator
        // =====================================

        function setActiveStep(activeStepNumber) {

            progressSteps.forEach(
                function (step) {

                    const stepNumber =
                        Number(step.dataset.step);

                    const numberCircle =
                        step.querySelector(
                            ".step-number"
                        );


                    step.classList.remove(
                        "active",
                        "completed"
                    );


                    if (stepNumber < activeStepNumber) {

                        step.classList.add(
                            "completed"
                        );

                        numberCircle.textContent =
                            "✓";

                    } else {

                        numberCircle.textContent =
                            stepNumber;

                    }


                    if (stepNumber === activeStepNumber) {

                        step.classList.add(
                            "active"
                        );

                    }

                }
            );

        }
		
		// =====================================
		// Clear One Field Error
		// =====================================

		function clearFieldError(
			inputElement,
			errorElement
		) {

			inputElement.classList.remove(
				"field-error"
			);

			errorElement.textContent =
				"";

		}


		// =====================================
		// Display One Field Error
		// =====================================

		function showFieldError(
			inputElement,
			errorElement,
			errorMessage
		) {

			inputElement.classList.remove(
				"field-valid"
			);

			inputElement.classList.add(
				"field-error"
			);

			errorElement.textContent =
				errorMessage;

		}


		// =====================================
		// Display Valid Field
		// =====================================

		function showFieldValid(
			inputElement,
			errorElement
		) {

			inputElement.classList.remove(
				"field-error"
			);

			inputElement.classList.add(
				"field-valid"
			);

			errorElement.textContent =
				"";

		}


		// =====================================
		// Check Whether All Details Are Valid
		//
		// This version checks silently. It does
		// not display error messages.
		// =====================================

		function bookingDetailsAreValid() {

			const nameValue =
				customerName.value.trim();

			const emailValue =
				customerEmail.value.trim();

			const confirmEmailValue =
				confirmEmail.value.trim();

			const phoneValue =
				customerPhone.value.trim();


			const nameIsValid =
				nameValue !== "";


			const emailIsValid =
				emailValue !== "" &&
				emailPattern.test(emailValue);


			const confirmEmailIsValid =
				confirmEmailValue !== "" &&
				confirmEmailValue === emailValue;


			// Phone is optional. It only needs
			// validation when the user enters one.

			const phoneIsValid =
				phoneValue === "" ||
				phonePattern.test(phoneValue);


			return (
				nameIsValid &&
				emailIsValid &&
				confirmEmailIsValid &&
				phoneIsValid
			);

		}


		// =====================================
		// Enable or Disable Review Button
		// =====================================

		function updateReviewButton() {

			reviewBookingButton.disabled =
				!bookingDetailsAreValid();

		}


		// =====================================
		// Validate Full Name
		// =====================================

		function validateCustomerName() {

			const nameValue =
				customerName.value.trim();


			clearFieldError(
				customerName,
				customerNameError
			);


			if (!nameValue) {

				showFieldError(
					customerName,
					customerNameError,
					"Please enter your full name."
				);

				return false;

			}


			showFieldValid(
				customerName,
				customerNameError
			);

			return true;

		}


		// =====================================
		// Validate Email
		// =====================================

		function validateCustomerEmail() {

			const emailValue =
				customerEmail.value.trim();


			clearFieldError(
				customerEmail,
				customerEmailError
			);


			if (!emailValue) {

				showFieldError(
					customerEmail,
					customerEmailError,
					"Please enter your email address."
				);

				return false;

			}


			if (!emailPattern.test(emailValue)) {

				showFieldError(
					customerEmail,
					customerEmailError,
					"Please enter a valid email address."
				);

				return false;

			}


			showFieldValid(
				customerEmail,
				customerEmailError
			);


			// The confirmation may have become
			// invalid if the first email changed.

			if (confirmEmail.value.trim() !== "") {

				validateConfirmEmail();

			}


			return true;

		}


		// =====================================
		// Validate Confirm Email
		// =====================================

		function validateConfirmEmail() {

			const emailValue =
				customerEmail.value.trim();

			const confirmEmailValue =
				confirmEmail.value.trim();


			clearFieldError(
				confirmEmail,
				confirmEmailError
			);


			// Confirm email is required.

			if (!confirmEmailValue) {

				showFieldError(
					confirmEmail,
					confirmEmailError,
					"Please confirm your email address."
				);

				return false;

			}


			// The original email must itself
			// be a valid email address.

			if (!emailPattern.test(emailValue)) {

				showFieldError(
					confirmEmail,
					confirmEmailError,
					"Please enter a valid email address above first."
				);

				return false;

			}


			// Both valid email values must match.

			if (confirmEmailValue !== emailValue) {

				showFieldError(
					confirmEmail,
					confirmEmailError,
					"Email addresses do not match."
				);

				return false;

			}


			showFieldValid(
				confirmEmail,
				confirmEmailError
			);

			return true;

		}


		// =====================================
		// Validate Optional Phone
		// =====================================

		function validateCustomerPhone() {

			const phoneValue =
				customerPhone.value.trim();


			clearFieldError(
				customerPhone,
				customerPhoneError
			);


			// An empty phone number is allowed.

			if (!phoneValue) {

				customerPhone.classList.remove(
					"field-valid"
				);

				return true;

			}


			if (!phonePattern.test(phoneValue)) {

				showFieldError(
					customerPhone,
					customerPhoneError,
					"Please enter a valid phone number beginning with +."
				);

				return false;

			}


			showFieldValid(
				customerPhone,
				customerPhoneError
			);

			return true;

		}


		// =====================================
		// Validate Entire Booking Form
		// =====================================

		function validateBookingDetails() {

			let hasErrors =
				false;


			if (!validateCustomerName()) {

				hasErrors =
					true;

			}


			if (!validateCustomerEmail()) {

				hasErrors =
					true;

			}


			if (!validateConfirmEmail()) {

				hasErrors =
					true;

			}


			if (!validateCustomerPhone()) {

				hasErrors =
					true;

			}


			updateReviewButton();


			return !hasErrors;

		}
				
				
		
		


        // =====================================
        // Quantity Controls
        // =====================================

        ticketOptions.forEach(
            function (ticketOption) {

                const increaseButton =
                    ticketOption.querySelector(
                        ".increase-button"
                    );

                const decreaseButton =
                    ticketOption.querySelector(
                        ".decrease-button"
                    );

                const quantityDisplay =
                    ticketOption.querySelector(
                        ".quantity-value"
                    );


                // Increase ticket quantity.

                increaseButton.addEventListener(
                    "click",
                    function () {

                        let quantity =
                            Number(
                                quantityDisplay.textContent
                            );


                        if (quantity < maxTickets) {

                            quantity++;

                            quantityDisplay.textContent =
                                quantity;

                            updateOrderSummary();

                        }

                    }
                );


                // Decrease ticket quantity.

                decreaseButton.addEventListener(
                    "click",
                    function () {

                        let quantity =
                            Number(
                                quantityDisplay.textContent
                            );


                        if (quantity > 0) {

                            quantity--;

                            quantityDisplay.textContent =
                                quantity;

                            updateOrderSummary();

                        }

                    }
                );

            }
        );


        // =====================================
        // Continue to Step 2
        // =====================================

        continueButton.addEventListener(
            "click",
            function () {

                if (currentTotalTickets === 0) {

                    return;

                }


                updateDetailsSummary();


                ticketSelectionStep.classList.add(
                    "d-none"
                );


                bookingDetailsStep.classList.remove(
                    "d-none"
                );


                setActiveStep(2);


                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );


        // =====================================
        // Return to Step 1
        // =====================================

        backToTicketsButton.addEventListener(
            "click",
            function () {

                bookingDetailsStep.classList.add(
                    "d-none"
                );


                ticketSelectionStep.classList.remove(
                    "d-none"
                );


                setActiveStep(1);


                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );
		
		
		// =====================================
		// Booking Form Validation Events
		// =====================================

		// Remove the error while the user
		// corrects the full name.

		customerName.addEventListener(
			"input",
			function () {

				clearFieldError(
					customerName,
					customerNameError
				);

				customerName.classList.remove(
					"field-valid"
				);

				updateReviewButton();

			}
		);


		// Validate when the user leaves the field.

		customerName.addEventListener(
			"blur",
			function () {

				validateCustomerName();

				updateReviewButton();

			}
		);


		// Email events.

		customerEmail.addEventListener(
			"input",
			function () {

				clearFieldError(
					customerEmail,
					customerEmailError
				);

				customerEmail.classList.remove(
					"field-valid"
				);

				confirmEmail.classList.remove(
					"field-valid"
				);

				updateReviewButton();

			}
		);


		customerEmail.addEventListener(
			"blur",
			function () {

				validateCustomerEmail();

				updateReviewButton();

			}
		);


		// Confirm-email events.

		confirmEmail.addEventListener(
			"input",
			function () {

				clearFieldError(
					confirmEmail,
					confirmEmailError
				);

				confirmEmail.classList.remove(
					"field-valid"
				);

				updateReviewButton();

			}
		);


		confirmEmail.addEventListener(
			"blur",
			function () {

				validateConfirmEmail();

				updateReviewButton();

			}
		);


		// Phone events.

		customerPhone.addEventListener(
			"input",
			function () {

				clearFieldError(
					customerPhone,
					customerPhoneError
				);

				customerPhone.classList.remove(
					"field-valid"
				);

				updateReviewButton();

			}
		);


		customerPhone.addEventListener(
			"blur",
			function () {

				validateCustomerPhone();

				updateReviewButton();

			}
		);


		// Keep the form from performing a normal
		// browser submission.

		bookingDetailsForm.addEventListener(
			"submit",
			function (event) {

				event.preventDefault();

				validateBookingDetails();

			}
		);


		// =====================================
		// Continue to Step 3
		// =====================================

		reviewBookingButton.addEventListener(
			"click",
			function () {

				// Recheck all details before moving.

				if (!validateBookingDetails()) {

					return;

				}


				// Build the review screen.

				updateReviewSummary();


				// Hide Step 2.

				bookingDetailsStep.classList.add(
					"d-none"
				);


				// Show Step 3.

				reviewBookingStep.classList.remove(
					"d-none"
				);


				// Update progress.

				setActiveStep(3);


				// Return to the top of the page.

				window.scrollTo({
					top: 0,
					behavior: "smooth"
				});

			}
		);
		
		
		// =====================================
		// Return to Step 2
		// =====================================

		backToDetailsButton.addEventListener(
			"click",
			function () {

				// Hide Step 3.

				reviewBookingStep.classList.add(
					"d-none"
				);


				// Show Step 2.

				bookingDetailsStep.classList.remove(
					"d-none"
				);


				// Update progress.

				setActiveStep(2);


				// Return to the top.

				window.scrollTo({
					top: 0,
					behavior: "smooth"
				});

			}
		);
		
		// =====================================
		// Confirm Booking - Move to Step 4
		// =====================================

		confirmBookingButton.addEventListener(
			"click",
			function () {

				// Recheck the booking details before
				// creating the confirmation.

				if (!validateBookingDetails()) {

					reviewBookingStep.classList.add(
						"d-none"
					);

					bookingDetailsStep.classList.remove(
						"d-none"
					);

					setActiveStep(2);

					return;

				}


				// Build Step 4 information.

				updateConfirmationSummary();


				// Hide Step 3.

				reviewBookingStep.classList.add(
					"d-none"
				);


				// Show Step 4.

				bookingConfirmedStep.classList.remove(
					"d-none"
				);


				// Update progress indicator.

				setActiveStep(4);


				// Return to top of page.

				window.scrollTo({
					top: 0,
					behavior: "smooth"
				});

			}
		);
		
		
		
		// =====================================
		// Generate Tickets - Move to Step 5
		// =====================================

		generateTicketButton.addEventListener(
			"click",
			function () {

				// Generate the individual
				// facsimile tickets.

				generateFacsimileTickets();
				
				
				// =====================================
				// Simulated Email Confirmation
				// =====================================

				// Display the validated email address
				// entered during Step 2.
				//
				// This only simulates an email being sent.
				// EventSphere does not actually send email.

				ticketEmailAddress.textContent =
					customerEmail.value.trim();


				// Hide Step 4.

				bookingConfirmedStep.classList.add(
					"d-none"
				);


				// Show Step 5.

				facsimileTicketStep.classList.remove(
					"d-none"
				);


				// Update progress indicator.

				setActiveStep(5);


				// Return to top of page.

				window.scrollTo({
					top: 0,
					behavior: "smooth"
				});

			}
		);


		// =====================================
		// Return to Confirmation - Step 4
		// =====================================

		backToConfirmationButton.addEventListener(
			"click",
			function () {

				// Hide Step 5.

				facsimileTicketStep.classList.add(
					"d-none"
				);


				// Show Step 4.

				bookingConfirmedStep.classList.remove(
					"d-none"
				);


				// Return progress to Step 4.

				setActiveStep(4);


				window.scrollTo({
					top: 0,
					behavior: "smooth"
				});

			}
		);


		// =====================================
		// Print Facsimile Tickets
		// =====================================

		printTicketsButton.addEventListener(
			"click",
			function () {

				window.print();

			}
		);
			


        // =====================================
        // Initial State
        // =====================================

        updateOrderSummary();

        setActiveStep(1);
		
		updateReviewButton();


        console.log(
            "EventSphere Tickets v1.4 loaded."
        );

    }
);