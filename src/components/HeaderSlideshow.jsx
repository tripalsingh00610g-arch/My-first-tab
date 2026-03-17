import { useState, useEffect, useCallback } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Button,
  Container,
  Chip,
  useScrollTrigger,
  Slide,
} from "@mui/material";
import { createTheme, ThemeProvider, alpha } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import NorthEastIcon from "@mui/icons-material/NorthEast";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#E8C547" },
    background: { default: "#0A0A0A", paper: "#111111" },
    text: { primary: "#F5F0E8", secondary: "#8A8378" },
  },
  typography: {
    fontFamily: "'Georgia', 'Times New Roman', serif",
    h1: { fontFamily: "'Georgia', serif", letterSpacing: "-0.03em" },
    h2: { fontFamily: "'Georgia', serif", letterSpacing: "-0.02em" },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 0, textTransform: "none", letterSpacing: "0.08em" },
      },
    },
  },
});

const slides = [
  {
    id: 1,
    tag: "ARCHITECTURE",
    title: "Where Brutalism Meets the Sky",
    subtitle: "The towers that defined a generation of urban thinking",
    year: "2024",
    bg: "linear-gradient(135deg, #0A0A0A 0%, #1a1208 50%, #2a1e0a 100%)",
    accent: "#E8C547",
    imageText: "01",
  },
  {
    id: 2,
    tag: "CULTURE",
    title: "The Last Analog Dreamers",
    subtitle: "A dying breed of creators who refuse the digital age",
    year: "2024",
    bg: "linear-gradient(135deg, #08080F 0%, #0d0d1a 50%, #131325 100%)",
    accent: "#7B8CDE",
    imageText: "02",
  },
  {
    id: 3,
    tag: "DESIGN",
    title: "Form Follows Feeling",
    subtitle: "How emotion became the new function in modern design",
    year: "2024",
    bg: "linear-gradient(135deg, #080F0A 0%, #0a1a0d 50%, #0d2210 100%)",
    accent: "#5ECE7B",
    imageText: "03",
  },
  {
    id: 4,
    tag: "TRAVEL",
    title: "Cities at the Edge of the World",
    subtitle: "Remote urban experiments redefining what a city can be",
    year: "2024",
    bg: "linear-gradient(135deg, #0F0808 0%, #1a0d0d 50%, #221313 100%)",
    accent: "#E87A5D",
    imageText: "04",
  },
];

const navLinks = ["Features", "Culture", "Design", "Archive", "About"];

function HideOnScroll({ children }) {
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const scrolled = useScrollTrigger({ disableHysteresis: true, threshold: 20 });

  return (
    <HideOnScroll>
      <AppBar
        elevation={0}
        sx={{
          background: scrolled
            ? alpha("#0A0A0A", 0.95)
            : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(232,197,71,0.15)" : "none",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <Toolbar
          sx={{
            maxWidth: 1400,
            mx: "auto",
            width: "100%",
            py: 2,
            px: { xs: 3, md: 6 },
            justifyContent: "space-between",
            minHeight: "80px !important",
          }}
        >
          {/* Logo */}
          <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
            <Typography
              sx={{
                fontFamily: "'Georgia', serif",
                fontSize: { xs: "1.6rem", md: "2rem" },
                fontWeight: 400,
                color: "#F5F0E8",
                letterSpacing: "-0.04em",
                lineHeight: 1,
              }}
            >
              MERIDIAN
            </Typography>
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                bgcolor: "#E8C547",
                mb: 0.5,
              }}
            />
          </Box>

          {/* Nav Links */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 4,
              alignItems: "center",
            }}
          >
            {navLinks.map((link, i) => (
              <Typography
                key={link}
                component="a"
                href="#"
                sx={{
                  fontFamily: "'Georgia', serif",
                  fontSize: "0.78rem",
                  letterSpacing: "0.12em",
                  color: i === 0 ? "#E8C547" : "rgba(245,240,232,0.55)",
                  textDecoration: "none",
                  textTransform: "uppercase",
                  transition: "color 0.2s",
                  "&:hover": { color: "#F5F0E8" },
                  position: "relative",
                  "&::after": i === 0 ? {
                    content: '""',
                    position: "absolute",
                    bottom: -4,
                    left: 0,
                    right: 0,
                    height: "1px",
                    bgcolor: "#E8C547",
                  } : {},
                }}
              >
                {link}
              </Typography>
            ))}
          </Box>

          {/* Right Actions */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button
              variant="outlined"
              size="small"
              sx={{
                display: { xs: "none", sm: "flex" },
                borderColor: "rgba(232,197,71,0.4)",
                color: "#E8C547",
                fontSize: "0.7rem",
                letterSpacing: "0.15em",
                py: 0.8,
                px: 2.5,
                "&:hover": {
                  borderColor: "#E8C547",
                  bgcolor: "rgba(232,197,71,0.08)",
                },
              }}
            >
              SUBSCRIBE
            </Button>
            <IconButton
              sx={{
                display: { xs: "flex", md: "none" },
                color: "#F5F0E8",
              }}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>

        {/* Mobile Menu */}
        {menuOpen && (
          <Box
            sx={{
              bgcolor: "#0A0A0A",
              borderTop: "1px solid rgba(232,197,71,0.1)",
              px: 3,
              py: 2,
              display: { md: "none" },
            }}
          >
            {navLinks.map((link) => (
              <Typography
                key={link}
                component="a"
                href="#"
                sx={{
                  display: "block",
                  py: 1.2,
                  fontFamily: "'Georgia', serif",
                  fontSize: "0.85rem",
                  letterSpacing: "0.1em",
                  color: "rgba(245,240,232,0.7)",
                  textDecoration: "none",
                  textTransform: "uppercase",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                  "&:hover": { color: "#E8C547" },
                }}
              >
                {link}
              </Typography>
            ))}
          </Box>
        )}
      </AppBar>
    </HideOnScroll>
  );
}

function Slideshow() {
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState(1);

  const goTo = useCallback(
    (index, dir = 1) => {
      if (animating || index === active) return;
      setDirection(dir);
      setPrev(active);
      setAnimating(true);
      setActive(index);
      setTimeout(() => {
        setPrev(null);
        setAnimating(false);
      }, 700);
    },
    [active, animating]
  );

  const next = () => goTo((active + 1) % slides.length, 1);
  const back = () => goTo((active - 1 + slides.length) % slides.length, -1);

  useEffect(() => {
    const id = setInterval(() => next(), 5500);
    return () => clearInterval(id);
  }, [active]);

  const slide = slides[active];

  return (
    <Box
      sx={{
        position: "relative",
        height: "100vh",
        minHeight: 600,
        overflow: "hidden",
        background: slide.bg,
        transition: "background 0.7s ease",
      }}
    >
      {/* Grid overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(232,197,71,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(232,197,71,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
          pointerEvents: "none",
        }}
      />

      {/* Giant slide number background */}
      <Box
        sx={{
          position: "absolute",
          right: { xs: "-5%", md: "5%" },
          top: "50%",
          transform: "translateY(-50%)",
          fontFamily: "'Georgia', serif",
          fontSize: { xs: "35vw", md: "22vw" },
          fontWeight: 700,
          color: "transparent",
          WebkitTextStroke: `1px ${alpha(slide.accent, 0.1)}`,
          lineHeight: 1,
          userSelect: "none",
          transition: "color 0.7s, -webkit-text-stroke-color 0.7s",
          pointerEvents: "none",
          letterSpacing: "-0.05em",
        }}
      >
        {slide.imageText}
      </Box>

      {/* Content */}
      <Container
        maxWidth={false}
        sx={{
          maxWidth: 1400,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          pb: { xs: 8, md: 10 },
          px: { xs: 3, md: 8 },
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Top meta row */}
        <Box
          sx={{
            position: "absolute",
            top: { xs: 100, md: 110 },
            left: { xs: 24, md: 64 },
            right: { xs: 24, md: 64 },
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Chip
            label={slide.tag}
            sx={{
              bgcolor: "transparent",
              border: `1px solid ${alpha(slide.accent, 0.5)}`,
              color: slide.accent,
              borderRadius: 0,
              fontSize: "0.65rem",
              letterSpacing: "0.2em",
              height: 28,
              fontFamily: "'Georgia', serif",
            }}
          />
          <Typography
            sx={{
              fontFamily: "'Georgia', serif",
              fontSize: "0.7rem",
              color: "rgba(245,240,232,0.3)",
              letterSpacing: "0.1em",
            }}
          >
            {slide.year} — ISSUE {active + 1}
          </Typography>
        </Box>

        {/* Main title */}
        <Box
          key={active}
          sx={{
            animation: "slideUp 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards",
            "@keyframes slideUp": {
              from: { opacity: 0, transform: "translateY(40px)" },
              to: { opacity: 1, transform: "translateY(0)" },
            },
          }}
        >
          <Typography
            sx={{
              fontFamily: "'Georgia', serif",
              fontSize: { xs: "2.4rem", sm: "3.5rem", md: "5.5rem", lg: "7rem" },
              fontWeight: 400,
              color: "#F5F0E8",
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
              maxWidth: "70%",
              mb: 3,
            }}
          >
            {slide.title}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 3 }}>
            <Typography
              sx={{
                fontFamily: "'Georgia', serif",
                fontSize: { xs: "0.9rem", md: "1.05rem" },
                color: "rgba(245,240,232,0.5)",
                letterSpacing: "0.02em",
                maxWidth: 420,
                fontStyle: "italic",
                lineHeight: 1.5,
              }}
            >
              {slide.subtitle}
            </Typography>

            <Button
              endIcon={<NorthEastIcon sx={{ fontSize: "0.85rem !important" }} />}
              sx={{
                color: slide.accent,
                borderBottom: `1px solid ${alpha(slide.accent, 0.4)}`,
                borderRadius: 0,
                pb: 0.5,
                fontSize: "0.75rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                "&:hover": {
                  bgcolor: "transparent",
                  borderBottomColor: slide.accent,
                },
              }}
            >
              Read Story
            </Button>
          </Box>
        </Box>

        {/* Bottom controls */}
        <Box
          sx={{
            position: "absolute",
            bottom: { xs: 28, md: 40 },
            left: { xs: 24, md: 64 },
            right: { xs: 24, md: 64 },
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Dots */}
          <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
            {slides.map((s, i) => (
              <Box
                key={i}
                onClick={() => goTo(i, i > active ? 1 : -1)}
                sx={{
                  cursor: "pointer",
                  width: i === active ? 32 : 6,
                  height: 2,
                  bgcolor: i === active ? slide.accent : "rgba(245,240,232,0.25)",
                  transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
                  "&:hover": { bgcolor: i === active ? slide.accent : "rgba(245,240,232,0.6)" },
                }}
              />
            ))}
          </Box>

          {/* Arrows */}
          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton
              onClick={back}
              size="small"
              sx={{
                border: "1px solid rgba(245,240,232,0.15)",
                borderRadius: 0,
                width: 44,
                height: 44,
                color: "rgba(245,240,232,0.5)",
                "&:hover": {
                  bgcolor: "rgba(232,197,71,0.08)",
                  borderColor: "rgba(232,197,71,0.4)",
                  color: "#E8C547",
                },
                transition: "all 0.2s",
              }}
            >
              <ArrowBackIosNewIcon sx={{ fontSize: "0.75rem" }} />
            </IconButton>
            <IconButton
              onClick={next}
              size="small"
              sx={{
                border: `1px solid ${alpha(slide.accent, 0.5)}`,
                borderRadius: 0,
                width: 44,
                height: 44,
                color: slide.accent,
                "&:hover": {
                  bgcolor: alpha(slide.accent, 0.12),
                  borderColor: slide.accent,
                },
                transition: "all 0.2s",
              }}
            >
              <ArrowForwardIosIcon sx={{ fontSize: "0.75rem" }} />
            </IconButton>
          </Box>
        </Box>
      </Container>

      {/* Progress bar */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: 2,
          bgcolor: alpha(slide.accent, 0.6),
          animation: "progress 5.5s linear infinite",
          "@keyframes progress": {
            from: { width: "0%" },
            to: { width: "100%" },
          },
          key: active,
        }}
      />
    </Box>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: "#0A0A0A", minHeight: "100vh" }}>
        <Header />
        <Slideshow />

        {/* Below fold preview */}
        <Box sx={{ bgcolor: "#0A0A0A", py: 10, px: { xs: 3, md: 8 }, maxWidth: 1400, mx: "auto" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 6 }}>
            <Box sx={{ height: 1, flex: 1, bgcolor: "rgba(245,240,232,0.08)" }} />
            <Typography sx={{ fontFamily: "'Georgia', serif", fontSize: "0.7rem", letterSpacing: "0.2em", color: "rgba(245,240,232,0.3)", textTransform: "uppercase" }}>
              Latest Features
            </Typography>
            <Box sx={{ height: 1, flex: 1, bgcolor: "rgba(245,240,232,0.08)" }} />
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" }, gap: 4 }}>
            {[
              { tag: "Essay", title: "The Quiet Death of Shared Space", color: "#E8C547" },
              { tag: "Photography", title: "Portraits From the End of the Glacier", color: "#7B8CDE" },
              { tag: "Interview", title: "The Architect Who Builds With Ash", color: "#5ECE7B" },
            ].map((card) => (
              <Box
                key={card.title}
                sx={{
                  borderTop: `1px solid ${alpha(card.color, 0.3)}`,
                  pt: 3,
                  cursor: "pointer",
                  "&:hover .arrow": { transform: "translate(4px, -4px)" },
                }}
              >
                <Typography sx={{ fontFamily: "'Georgia', serif", fontSize: "0.65rem", letterSpacing: "0.2em", color: card.color, textTransform: "uppercase", mb: 1.5 }}>
                  {card.tag}
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 2 }}>
                  <Typography sx={{ fontFamily: "'Georgia', serif", fontSize: "1.15rem", color: "#F5F0E8", lineHeight: 1.35, letterSpacing: "-0.01em" }}>
                    {card.title}
                  </Typography>
                  <NorthEastIcon className="arrow" sx={{ color: alpha(card.color, 0.5), fontSize: "1rem", flexShrink: 0, mt: 0.3, transition: "transform 0.2s" }} />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}