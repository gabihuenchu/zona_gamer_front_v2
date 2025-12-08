import React, { act } from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import App from "../src/pages/App";
import { BrowserRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

const renderWithRouter = (component) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('App (Home Page)', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
    });

    describe('Navbar', () => {
        it('renderiza el logo y marca correctamente', () => {
            renderWithRouter(<App />);
            
            expect(screen.getByAltText('logo')).toBeInTheDocument();
            
            const zonaGamerTexts = screen.getAllByText('Zona Gamer');
            expect(zonaGamerTexts.length).toBeGreaterThan(0);
            
            const navbar = screen.getByRole('navigation');
            expect(within(navbar).getByText('Zona Gamer')).toBeInTheDocument();
        });

        it('renderiza todos los links de navegacion', () => {
            renderWithRouter(<App />);
            
            expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
            expect(screen.getByRole('link', { name: /productos/i })).toBeInTheDocument();
            expect(screen.getByRole('link', { name: /nosotros/i })).toBeInTheDocument();
            expect(screen.getByRole('link', { name: /blogs/i })).toBeInTheDocument();
            expect(screen.getByRole('link', { name: /registrate/i })).toBeInTheDocument();
        });

        it('renderiza el boton de inicio de sesion', () => {
            renderWithRouter(<App />);
            
            expect(screen.getByRole('link', { name: /iniciar sesión/i })).toBeInTheDocument();
        });

        it('renderiza el icono del carrito con contador', () => {
            renderWithRouter(<App />);
            
            const badge = screen.getByText('0');
            expect(badge).toBeInTheDocument();
            expect(badge).toHaveClass('cart-count');
        });

        it('los links de navegacion tienen las rutas correctas', () => {
            renderWithRouter(<App />);
            
            expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute('href', '/');
            expect(screen.getByRole('link', { name: /productos/i })).toHaveAttribute('href', '/productos');
            expect(screen.getByRole('link', { name: /nosotros/i })).toHaveAttribute('href', '/nosotros');
            expect(screen.getByRole('link', { name: /blogs/i })).toHaveAttribute('href', '/blogs');
            expect(screen.getByRole('link', { name: /registrate/i })).toHaveAttribute('href', '/registro');
            expect(screen.getByRole('link', { name: /iniciar sesión/i })).toHaveAttribute('href', '/login');
        });

        it('el navbar es responsive y muestra el toggler en mobile', () => {
            renderWithRouter(<App />);
            
            const toggleButton = screen.getByRole('button', { name: /toggle navigation/i });
            expect(toggleButton).toBeInTheDocument();
            expect(toggleButton).toHaveClass('navbar-toggler');
        });
    });

    describe('Renderizado inicial', () => {
        it('renderiza el titulo principal correctamente', () => {
            renderWithRouter(<App />);
            const heading = screen.getByRole('heading', { level: 1 });
            expect(heading).toHaveTextContent('GAMER ZONE');
        });

        it('renderiza los botones de accion del hero', () => {
            renderWithRouter(<App />);
            expect(screen.getByRole('button', { name: /Explorar Productos/i })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /Unirse a la comunidad/i })).toBeInTheDocument();
        });

        it('muestra la primera imagen del banner al inicio', () => {
            renderWithRouter(<App />);
            const images = screen.getAllByRole('img');
            const bannerImages = images.filter(img => img.alt && img.alt.startsWith('Banner'));
            expect(bannerImages[0]).toHaveAttribute('alt', 'Banner 1');
        });
    });

    describe('Carrusel de banners', () => {
        it('cambia de slide automaticamente despues de 4 segundos', async () => {
            renderWithRouter(<App />);

            const images = screen.getAllByRole('img');
            const slides = images.filter(img => img.alt && img.alt.startsWith('Banner'));

            expect(slides[0].parentElement).toHaveClass('active');

            await act(async () => {
                vi.advanceTimersByTime(4000);
            });

            expect(slides[1].parentElement).toHaveClass('active');
        });

        it('navega a la slide correcta al hacer click en los dots', () => {
            renderWithRouter(<App />);

            const dots = screen.getAllByRole('button').filter(btn =>
                btn.className && btn.className.includes('dot')
            );

            fireEvent.click(dots[2]);

            const images = screen.getAllByRole('img');
            const slides = images.filter(img => img.alt && img.alt.startsWith('Banner'));
            expect(slides[2].parentElement).toHaveClass('active');
        });

        it('limpia el intervalo al desmontar el componente', () => {
            const clearIntervalSpy = vi.spyOn(globalThis, 'clearInterval');
            const { unmount } = renderWithRouter(<App />);

            unmount();

            expect(clearIntervalSpy).toHaveBeenCalled();
            clearIntervalSpy.mockRestore();
        });
    });

    describe('Navegacion', () => {
        it('navega a /productos al hacer click en "Explorar Productos"', () => {
            renderWithRouter(<App />);

            const btnExplorar = screen.getByRole('button', { name: /Explorar Productos/i });
            fireEvent.click(btnExplorar);

            expect(mockNavigate).toHaveBeenCalledWith('/productos');
        });

        it('navega a /registro al hacer click en "Unirse a la Comunidad"', () => {
            renderWithRouter(<App />);

            const btnRegistro = screen.getByRole('button', { name: /Unirse a la Comunidad/i });
            fireEvent.click(btnRegistro);

            expect(mockNavigate).toHaveBeenCalledWith('/registro');
        });
    });

    describe('Seccion de Servicios', () => {
        it('renderiza el titulo de servicios', () => {
            renderWithRouter(<App />);
            
            expect(screen.getByRole('heading', { name: /nuestros servicios/i })).toBeInTheDocument();
        });

        it('renderiza las tres tarjetas de servicio', () => {
            renderWithRouter(<App />);
            
            expect(screen.getByText('Arma tu PC')).toBeInTheDocument();
            expect(screen.getByText('Servicio Técnico')).toBeInTheDocument();
            expect(screen.getByText('Equipos Gamer')).toBeInTheDocument();
        });

        it('cada tarjeta tiene su boton de accion', () => {
            renderWithRouter(<App />);
            
            expect(screen.getByRole('button', { name: /comenzar proyecto/i })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /solicitar servicio/i })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /ver catálogo/i })).toBeInTheDocument();
        });
    });

    describe('Seccion de Features', () => {
        it('renderiza el titulo de features', () => {
            renderWithRouter(<App />);
            
            expect(screen.getByRole('heading', { name: /por qué elegir zona gamer/i })).toBeInTheDocument();
        });

        it('muestra las tres caracteristicas principales', () => {
            renderWithRouter(<App />);
            
            expect(screen.getByText(/envío express 24\/48h/i)).toBeInTheDocument();
            expect(screen.getByText(/garantía extendida/i)).toBeInTheDocument();
            expect(screen.getByText(/asesoramiento experto/i)).toBeInTheDocument();
        });
    });
});
