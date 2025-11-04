import type { JSXConvertersFunction } from "@payloadcms/richtext-lexical/react";
import type {
  DefaultNodeTypes
} from '@payloadcms/richtext-lexical'
import {} from "@/payload-types"
import { TextWithImageBlock } from "@/components/blocks/TextWithImageBlock";
import { ParagraphBlock } from "@/components/blocks/ParagraphBlock";
import { ImageBlock } from "@/components/blocks/ImageBlock";
import { HeadingBlock } from "@/components/blocks/HeaderBlock";
import { ImageGalleryBlock } from "@/components/blocks/ImageGalleryBlock";
import { ContactsBlock } from "@/components/blocks/ContactsBlock";




const jsxConverters: JSXConvertersFunction<DefaultNodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  blocks : {
    header : ({node} : {node:any}) => <HeadingBlock text={node.fields.text} tag={node.fields.level} color={node.fields.color} />,
    textWithImage : ({node} : {node : any}) => <TextWithImageBlock text={node.fields.text} imagePosition={node.fields.imagePosition} image={node.fields.image}  />,
    paragraph : ({node} : {node:any}) => <ParagraphBlock text={node.fields.text} />,
    image : ({node} : {node:any}) => <ImageBlock image={node.fields.image}  />,
    imageGallery : ({node} : {node:any}) => <ImageGalleryBlock imagesData={node.fields.images} columns={node.fields.columns} />,
    contacts : ({node} : {node:any}) => <ContactsBlock contacts={node.fields.contacts} />
  } 
})

export default jsxConverters
