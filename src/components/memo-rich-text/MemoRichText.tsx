import jsxConverters from "@/utils/jsx-converters";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { memo } from "react";

interface IMemoRichText{
    data : any
}
const MemoRichText = ({data}:IMemoRichText) => {
    console.log("Рендер rich текста")
    return (
        <RichText data={data} converters={jsxConverters} />
    );
};

export default memo(MemoRichText);
