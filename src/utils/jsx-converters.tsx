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
import { ListBlock } from "@/components/blocks/ListBlock";
import { TextBlock } from "@/components/blocks/TextBlock";
import { BoxContentBlock } from "@/components/blocks/BoxContentBlock";
import { AccordionBlock } from "@/components/blocks/AccordionBlock";
import { BookingButtonBlock } from "@/components/blocks/BookingButtonBlock";
import { IconCardsBlock } from "@/components/blocks/IconCardsBlock";
import { ImageSliderBlock } from "@/components/blocks/ImageSliderBlock";

const jsxConverters: JSXConvertersFunction<DefaultNodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  blocks : {
    header : ({node} : {node:any}) => <HeadingBlock text={node.fields.text} tag={node.fields.level} color={node.fields.color} />,
    textWithImage : ({node} : {node : any}) => <TextWithImageBlock text={node.fields.text} imagePosition={node.fields.imagePosition} image={node.fields.image}  />,
    paragraph : ({node} : {node:any}) => <ParagraphBlock text={node.fields.text} />,
    image : ({node} : {node:any}) => <ImageBlock image={node.fields.image}  />,
    imageGallery : ({node} : {node:any}) => <ImageGalleryBlock imagesData={node.fields.images} columns={node.fields.columns} />,
    contacts : ({node} : {node:any}) => <ContactsBlock contacts={node.fields.contacts} />,
    list : ({node} : {node : any}) => <ListBlock items={node.fields.items} />,
    text : ({node} : {node : any}) => <TextBlock text={node.fields.text} size={node.fields.size} />,
    boxContent : ({node} : {node : any}) => <BoxContentBlock content={node.fields.content} />,
    accordion : ({node} : {node : any}) => <AccordionBlock title={node.fields.title} content={node.fields.content} />,
    bookingButton : ({node} : {node : any}) => <BookingButtonBlock buttonText={node.fields.buttonText} variant={node.fields.variant} size={node.fields.size} alignment={node.fields.alignment} />,
    iconCards : ({node} : {node : any}) => <IconCardsBlock columns={node.fields.columns} cards={node.fields.cards} />,
    imageSlider : ({node} : {node : any}) => <ImageSliderBlock images={node.fields.images} autoplay={node.fields.autoplay} autoplayDelay={node.fields.autoplayDelay} showArrows={node.fields.showArrows} showDots={node.fields.showDots} />
  } 
})

export default jsxConverters
