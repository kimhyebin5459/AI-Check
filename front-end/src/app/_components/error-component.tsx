import NoticePage from "@/components/common/NoticePage"
import { useRouter } from "next/navigation"

export default function ErrorComponent() {
    const router = useRouter();

    return(
        <NoticePage buttonText="돌아가기" onButtonClick={()=>{router.back()}} title="앗!" message="무엇인가 잘못되었어요. 다시 시도해보세요." iconType="error"></NoticePage>
    )
}