import Header from '@/components/common/Header';

export default function Page() {
  return (
    <div className="container justify-center">
      <Header hasBackButton hasBorder={false} />
      <p className="text-mdl font-bold">누구에게 돈을 보낼까요?</p>
    </div>
  );
}
