/**
 * Preview Link Block - Frontend Tooltip Handler
 * 
 * Listens for hover on .preview-link elements and displays
 * a tooltip with preview text and optional image.
 */

( function() {
	'use strict';

	/**
	 * Create and show tooltip on hover
	 */
	function initPreviewLinks() {
		const links = document.querySelectorAll( 'a.preview-link' );

		links.forEach( ( link ) => {
			let tooltip = null;

			link.addEventListener( 'mouseenter', function( e ) {
				// Don't create duplicate tooltips
				if ( tooltip ) {
					return;
				}

				try {
					const previewData = JSON.parse( this.getAttribute( 'data-preview' ) );

					// Create tooltip element
					tooltip = document.createElement( 'div' );
					tooltip.className = 'preview-link-tooltip';

					// Add image if provided
					if ( previewData.image ) {
						const img = document.createElement( 'img' );
						img.src = previewData.image;
						img.alt = previewData.alt || 'Preview image';
						img.className = 'preview-link-tooltip-image';
						tooltip.appendChild( img );
					}

					// Add text
					const textDiv = document.createElement( 'div' );
					textDiv.className = 'preview-link-tooltip-text';
					textDiv.textContent = previewData.text;
					tooltip.appendChild( textDiv );

					// Append to body (not link, for z-index layering)
					document.body.appendChild( tooltip );

					// Position tooltip near the link
					positionTooltip( link, tooltip );

					// Add visible class after a frame for smooth fade-in
					requestAnimationFrame( () => {
						tooltip.classList.add( 'visible' );
					} );

				} catch ( err ) {
					console.error( 'Preview Link Block: Failed to parse preview data', err );
				}
			} );

			link.addEventListener( 'mouseleave', function() {
				if ( tooltip ) {
					tooltip.remove();
					tooltip = null;
				}
			} );

			// Also hide tooltip if mouse leaves the tooltip itself
			link.addEventListener( 'mousemove', function( e ) {
				if ( tooltip ) {
					positionTooltip( this, tooltip );
				}
			} );
		} );
	}

	/**
	 * Position tooltip relative to link, avoiding viewport edges
	 */
	function positionTooltip( link, tooltip ) {
		const rect = link.getBoundingClientRect();
		const tooltipWidth = 280; // Match CSS max-width
		const tooltipHeight = tooltip.offsetHeight;
		const offset = 10; // Distance from link

		let top = rect.bottom + offset;
		let left = rect.left + rect.width / 2 - tooltipWidth / 2;

		// Adjust if tooltip goes off right edge
		if ( left + tooltipWidth > window.innerWidth ) {
			left = window.innerWidth - tooltipWidth - 10;
		}

		// Adjust if tooltip goes off left edge
		if ( left < 10 ) {
			left = 10;
		}

		// Adjust if tooltip goes off bottom (show above instead)
		if ( top + tooltipHeight > window.innerHeight ) {
			top = rect.top - tooltipHeight - offset;
		}

		tooltip.style.left = left + 'px';
		tooltip.style.top = top + 'px';
	}

	// Initialize when DOM is ready
	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', initPreviewLinks );
	} else {
		initPreviewLinks();
	}

	// Also handle dynamic content (useful for AJAX-loaded posts)
	const observer = new MutationObserver( initPreviewLinks );
	observer.observe( document.body, { childList: true, subtree: true } );

} )();
