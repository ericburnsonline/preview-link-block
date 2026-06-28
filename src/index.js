import { registerBlockType } from '@wordpress/blocks';
import { 
	RichText, 
	BlockControls, 
	InspectorControls,
	MediaUpload,
	useBlockProps
} from '@wordpress/block-editor';
import {
	Button,
	PanelBody,
	TextControl,
	TextareaControl,
	ResponsiveWrapper
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import metadata from './block.json';
import './editor.css';

registerBlockType( metadata.name, {
	edit: ( { attributes, setAttributes } ) => {
		const {
			linkText,
			linkUrl,
			previewText,
			previewImageId,
			previewImageUrl,
			previewImageAlt
		} = attributes;

		const blockProps = useBlockProps();

		const onSelectImage = ( media ) => {
			setAttributes( {
				previewImageId: media.id,
				previewImageUrl: media.url,
				previewImageAlt: media.alt || ''
			} );
		};

		const onRemoveImage = () => {
			setAttributes( {
				previewImageId: 0,
				previewImageUrl: '',
				previewImageAlt: ''
			} );
		};

		return (
			<>
				<BlockControls />

				<InspectorControls>
					<PanelBody title={ __( 'Link Settings', 'preview-link-block' ) }>
						<TextControl
							label={ __( 'Link Text', 'preview-link-block' ) }
							value={ linkText }
							onChange={ ( value ) =>
								setAttributes( { linkText: value } )
							}
							help={ __( 'The text visitors will see and click', 'preview-link-block' ) }
						/>

						<TextControl
							label={ __( 'Link URL', 'preview-link-block' ) }
							value={ linkUrl }
							onChange={ ( value ) =>
								setAttributes( { linkUrl: value } )
							}
							type="url"
							help={ __( 'Where the link goes when clicked', 'preview-link-block' ) }
						/>
					</PanelBody>

					<PanelBody title={ __( 'Preview Settings', 'preview-link-block' ) }>
						<TextareaControl
							label={ __( 'Preview Explanation', 'preview-link-block' ) }
							value={ previewText }
							onChange={ ( value ) =>
								setAttributes( { previewText: value } )
							}
							help={ __( 'Your custom explanation that appears on hover. Keep it concise and clear.', 'preview-link-block' ) }
							rows={ 4 }
						/>

						<div style={ { marginTop: '20px' } }>
							<div style={ { marginBottom: '10px', fontWeight: 'bold' } }>
								{ __( 'Preview Image (Optional)', 'preview-link-block' ) }
							</div>

							{ previewImageUrl ? (
								<>
									<div style={ { marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px', padding: '10px' } }>
										<img
											src={ previewImageUrl }
											alt={ previewImageAlt }
											style={ {
												maxWidth: '100%',
												height: 'auto',
												borderRadius: '4px'
											} }
										/>
									</div>
									<Button
										isDestructive
										onClick={ onRemoveImage }
										variant="secondary"
									>
										{ __( 'Remove Image', 'preview-link-block' ) }
									</Button>
								</>
							) : (
								<MediaUpload
									onSelect={ onSelectImage }
									allowedTypes={ [ 'image' ] }
									render={ ( { open } ) => (
										<Button
											onClick={ open }
											variant="secondary"
										>
											{ __( 'Select Image', 'preview-link-block' ) }
										</Button>
									) }
								/>
							) }
						</div>
					</PanelBody>
				</InspectorControls>

				{/* Editor Preview */}
				<div { ...blockProps }>
					<div className="preview-link-editor-container">
						<div className="preview-link-editor-link">
							<a href={ linkUrl } onClick={ ( e ) => e.preventDefault() }>
								{ linkText || 'Link text' }
							</a>
							<span className="preview-link-hover-indicator">
								ℹ️ Hover preview
							</span>
						</div>

						{/* Editor preview of tooltip */}
						<div className="preview-link-editor-preview">
							<div className="preview-link-tooltip-preview">
								{ previewImageUrl && (
									<div className="preview-link-tooltip-image">
										<img
											src={ previewImageUrl }
											alt={ previewImageAlt }
										/>
									</div>
								) }
								<div className="preview-link-tooltip-text">
									{ previewText }
								</div>
							</div>
						</div>
					</div>
				</div>
			</>
		);
	},

	save: ( { attributes } ) => {
		const {
			linkText,
			linkUrl,
			previewText,
			previewImageUrl,
			previewImageAlt
		} = attributes;

		const blockProps = useBlockProps.save();

		// Encode preview data as JSON in data attribute for frontend JS to parse
		const previewData = {
			text: previewText,
			image: previewImageUrl,
			alt: previewImageAlt
		};

		return (
			<div { ...blockProps }>
				
					href={ linkUrl }
					className="preview-link"
					data-preview={ JSON.stringify( previewData ) }
				>
					{ linkText }
				</a>
			</div>
		);
	}
} );
