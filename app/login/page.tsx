import MobileAuthCard from "@/components/MobileAuthCard";
import { getRenderImageMap } from "@/lib/imageSlotsServer";

// 會員登入/會員註冊/忘記密碼 (/login) — reached from MobileStatusBoard's
// 登入/註冊 buttons.
export default function LoginPage() {
  const images = getRenderImageMap();
  return <MobileAuthCard images={images} />;
}
