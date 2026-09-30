import { Button, Ornament } from "@/components/ds";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="page page-inner" id="main">
        <div className="menu-empty">
          <Ornament size={96} className="accent-orn" />
          <h1 className="display-l">Такой страницы нет</h1>
          <p className="muted">Возможно, блюдо убрали из меню или ссылка устарела.</p>
          <div className="hero-actions">
            <Button variant="primary" icon="arrow-right" href="/menu">
              Смотреть меню
            </Button>
            <Button variant="outline" href="/">
              На главную
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
