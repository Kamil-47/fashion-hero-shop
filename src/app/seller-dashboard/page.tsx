"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { CloseIcon } from "@/components/icons";
import { useAuth } from "@/components/auth-provider";

export default function SellerDashboardPage() {
  const { logout } = useAuth();
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [closing, setClosing] = useState(false);

  const closeModal = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setModalOpen(false);
      setClosing(false);
    }, 200);
  }, []);

  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeModal(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [modalOpen, closeModal]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Row 1: seller identity */}
      <div className="flex items-center justify-between mb-6 pb-6 border-b border-black/10">
        <div>
          <h1 className="text-4xl font-light text-charcoal font-[Georgia]">Dorota</h1>
          <p className="text-[14px] text-warm-gray mt-0.5">Welcome back to your FashionHero seller panel.</p>
        </div>
        <span className="text-[11px] font-medium uppercase tracking-[0.5px] border border-black/20 rounded-full px-3 py-1 text-warm-gray">
          Plan: Podstawowy
        </span>
      </div>

      {/* Row 2: stats + CTA */}
      <div className="flex items-center justify-between gap-6 pb-6 border-b border-black/10">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.6px] text-charcoal mb-2">Sales Performance</p>
          <p className="text-sm text-warm-gray leading-relaxed">
            Twoja sprzedaż w ostatnim miesiącu wyniosła <span className="font-semibold text-charcoal">1 240 zł</span>.<br />
            Sprawdź, jak możesz ją poprawić.
          </p>
        </div>
        <button
          className="btn-cta shrink-0 whitespace-nowrap"
          onClick={() => setModalOpen(true)}
        >
          Jak poprawić sprzedaż?
        </button>
      </div>

      {/* Recent Orders */}
      <div className="mt-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.6px] text-charcoal mb-4">Recent Orders</p>
        <div className="divide-y divide-black/10">
          {[
            { id: "SF-10042", date: "March 15, 2026",   amount: "592 zł" },
            { id: "SF-10038", date: "February 22, 2026", amount: "940 zł" },
            { id: "SF-10031", date: "January 8, 2026",  amount: "480 zł" },
          ].map((order) => (
            <div key={order.id} className="flex items-center justify-between py-4">
              <div>
                <p className="text-sm font-semibold text-charcoal">{order.id}</p>
                <p className="text-[12px] text-warm-gray mt-0.5">{order.date}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-charcoal">{order.amount}</p>
                <p className="text-[12px] text-teal-700 mt-0.5">Delivered</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Account Details */}
      <div className="mt-8 pt-6 border-t border-black/10">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.6px] text-charcoal">Account Details</p>
          <button className="text-sm text-warm-gray hover:text-charcoal transition-colors">Edit</button>
        </div>
        <p className="text-sm text-teal-700">Dorota</p>
        <p className="text-sm text-teal-700 mt-0.5">dorota@example.com</p>
        <p className="text-[12px] text-warm-gray mt-1">Source: paid_campaign · New seller</p>
        <button
          onClick={() => { logout(); router.push("/"); }}
          className="btn-cta-outline text-[12px] w-full mt-6"
        >
          SIGN OUT
        </button>
      </div>

      {/* Modal */}
      {(modalOpen || closing) && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${closing ? "animate-out fade-out duration-200 fill-mode-[forwards]" : "animate-in fade-in duration-200"}`}>
          <div
            className="absolute inset-0 bg-black/40"
            onClick={closeModal}
          />
          <div className={`relative bg-white rounded-lg max-w-sm w-full p-8 z-10 ${closing ? "animate-out fade-out zoom-out-95 duration-200 fill-mode-[forwards]" : "animate-in fade-in zoom-in-95 duration-200"}`}>
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-1 hover:opacity-60 transition-opacity"
              aria-label="Zamknij"
            >
              <CloseIcon />
            </button>
            <h2 className="text-2xl font-light text-charcoal mb-3 text-center font-[Georgia]">Już niedługo!</h2>
            <p className="text-sm text-warm-gray leading-relaxed mb-6 text-center">
              Funkcja <span className="font-medium">„Jak poprawić sprzedaż?"</span> jest w przygotowaniu. Pracujemy nad spersonalizowanymi rekomendacjami, które pomogą Ci zwiększyć konwersję i zmniejszyć liczbę zwrotów.
            </p>
            <p className="text-sm text-warm-gray leading-relaxed mb-6 text-center">Dziękujemy za zainteresowanie - damy znać, gdy tylko będzie gotowa.</p>
            <button
              className="btn-cta w-full"
              onClick={closeModal}
            >
             Rozumiem
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
