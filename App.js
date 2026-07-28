import { h, render } from 'https://esm.sh/preact@10.19.3';
import { useEffect, useRef } from 'https://esm.sh/preact@10.19.3/hooks';
import htm from 'https://esm.sh/htm@3.1.1';
import { Renderer, Program, Mesh, Color, Triangle } from 'https://esm.sh/ogl@1.0.1';

const html = htm.bind(h);

// ---- ICONS ----
const GithubIcon = () => html`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>`;
const LinkedinIcon = () => html`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>`;
const MailIcon = () => html`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`;
const PhoneIcon = () => html`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`;
const ArrowRightIcon = () => html`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`;

// ---- SHADER CODE ----
const VERTEX_SHADER = `#version 300 es
in vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;
uniform float uTime; uniform float uAmplitude; uniform vec3 uColorStops[3];
uniform vec2 uResolution; uniform float uBlend; uniform vec2 uMouse;
out vec4 fragColor;
vec3 permute(vec3 x){return mod(((x*34.0)+1.0)*x,289.0);}
float snoise(vec2 v){
  const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
  vec2 i=floor(v+dot(v,C.yy)); vec2 x0=v-i+dot(i,C.xx);
  vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);
  vec4 x12=x0.xyxy+C.xxzz; x12.xy-=i1; i=mod(i,289.0);
  vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
  vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0);
  m=m*m; m=m*m; vec3 x=2.0*fract(p*C.www)-1.0; vec3 h=abs(x)-0.5;
  vec3 ox=floor(x+0.5); vec3 a0=x-ox;
  m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);
  vec3 g; g.x=a0.x*x0.x+h.x*x0.y; g.yz=a0.yz*x12.xz+h.yz*x12.yw;
  return 130.0*dot(m,g);
}
struct ColorStop { vec3 color; float position; };
#define COLOR_RAMP(colors,factor,finalColor){ \
  int index=0; \
  for(int i=0;i<2;i++){ \
    ColorStop currentColor=colors[i]; \
    bool inBetween=currentColor.position<=factor; \
    index=int(mix(float(index),float(i),float(inBetween))); \
  } \
  ColorStop currentColor=colors[index]; \
  ColorStop nextColor=colors[index+1]; \
  float range=nextColor.position-currentColor.position; \
  float lerpFactor=(factor-currentColor.position)/range; \
  finalColor=mix(currentColor.color,nextColor.color,lerpFactor); \
}
void main(){
  vec2 uv=gl_FragCoord.xy/uResolution;
  vec2 m = uMouse / uResolution;
  ColorStop colors[3];
  colors[0]=ColorStop(uColorStops[0],0.0);
  colors[1]=ColorStop(uColorStops[1],0.5);
  colors[2]=ColorStop(uColorStops[2],1.0);
  vec3 rampColor;
  COLOR_RAMP(colors, uv.x, rampColor);
  float noise = snoise(vec2(uv.x * 3.0, uTime * 0.2 + m.x * 0.5));
  float waveHeight = uv.y - (noise * 0.15 * uAmplitude);
  float fade = smoothstep(0.0, 0.4, uv.y);
  waveHeight = mix(uv.y, waveHeight, fade);
  float core = 0.5;
  float intensity = smoothstep(core - uBlend, core + uBlend, waveHeight);
  fragColor = vec4(intensity * rampColor * intensity, intensity);
}
`;

function AuroraShader({ colorStops = ["#5227FF", "#7cff67", "#5227FF"], amplitude = 1.0, blend = 0.5, speed = 1.0 }) {
  const containerRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const renderer = new Renderer({ alpha: true, antialias: true });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    const geometry = new Triangle(gl);
    if (geometry.attributes.uv) delete geometry.attributes.uv;

    const program = new Program(gl, {
      vertex: VERTEX_SHADER,
      fragment: FRAGMENT_SHADER,
      uniforms: {
        uTime: { value: 0 },
        uAmplitude: { value: amplitude },
        uBlend: { value: blend },
        uResolution: { value: [window.innerWidth, window.innerHeight] },
        uColorStops: {
          value: colorStops.map((hex) => {
            const c = new Color(hex);
            return [c.r, c.g, c.b];
          }),
        },
        uMouse: { value: [0, 0] },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });
    container.appendChild(gl.canvas);

    const resize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      program.uniforms.uResolution.value = [window.innerWidth, window.innerHeight];
    };
    window.addEventListener("resize", resize);
    resize();

    const onMouseMove = (e) => {
      mouseRef.current.x += (e.clientX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (e.clientY - mouseRef.current.y) * 0.05;
    };
    window.addEventListener("mousemove", onMouseMove);

    let animationId;
    const animate = (t) => {
      animationId = requestAnimationFrame(animate);
      program.uniforms.uTime.value = t * 0.001 * speed;
      program.uniforms.uMouse.value = [mouseRef.current.x, mouseRef.current.y];
      renderer.render({ scene: mesh });
    };
    animate(0);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      if (gl.canvas.parentNode === container) container.removeChild(gl.canvas);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [amplitude, blend, colorStops, speed]);

  return html`<div ref=${containerRef} style=${{ width: '100%', height: '100%', position: 'fixed', top: 0, left: 0, zIndex: -1, pointerEvents: 'none' }}></div>`;
}

// ---- MAIN APP ----
const App = () => {
    // Scroll reveal logic
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.1 });
        
        document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

        // Navbar scroll effect
        const handleScroll = () => {
            const nav = document.querySelector('nav');
            if (window.scrollY > 50) nav.classList.add('scrolled');
            else nav.classList.remove('scrolled');
        };
        window.addEventListener('scroll', handleScroll);
        
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const projects = [
        {
            title: "Vehicle Routing Problem with Time Windows (VRPTW)",
            date: "July 2026 - August 2026",
            tech: ["Python", "Google OR-Tools", "SQLite", "Streamlit", "Folium", "Plotly", "OSRM"],
            desc: "Engineered an automated VRPTW optimization engine using Google OR-Tools to solve complex multi-constraint logistics workflows. Curated relational SQLite schemas and integrated OSRM network matrices with disjunction-based infeasibility handling."
        },
        {
            title: "AI-Based Logistics Network Optimizer",
            date: "June 2026 - July 2026",
            tech: ["Python", "Google OR-Tools", "SQLite", "Streamlit", "NetworkX", "Machine Learning"],
            desc: "Developed a supply chain optimization system using Linear Programming to automate transportation allocation. Integrated ML-based demand forecasting models (Random Forest/XGBoost) to enhance predictive planning accuracy."
        },
        {
            title: "Intrusion Detection System for IoT Networks",
            date: "July 2026 - Present",
            tech: ["PyTorch", "Scikit-learn", "High-Dimensional Data", "Cybersecurity"],
            desc: "Developing an AI-driven threat classification pipeline leveraging PyTorch to automate real-time cyber threat detection and anomaly mitigation across IoT network traffic."
        },
        {
            title: "StructuralEye: Crack Detection System",
            date: "March 2026 - April 2026",
            tech: ["Computer Vision", "OpenCV", "CLAHE", "Morphological Operations"],
            desc: "Automated manual structural inspection workflows using computer vision. Extracted physical dimensions to compute dynamic risk scores and establish baseline severity KPIs for defect monitoring."
        },
        {
            title: "AI-Based Fake News Detection System",
            date: "December 2025 - January 2026",
            tech: ["NLP", "TF-IDF", "Logistic Regression", "Naive Bayes"],
            desc: "Built an NLP classification pipeline to classify content and automate information verification workflows. Evaluated against precision, recall, and F1-score metrics to ensure reliable prediction accuracy."
        }
    ];

    const experience = [
        {
            title: "Events Head — The Otaku Club",
            org: "VIT Vellore",
            date: "2024 - 2025",
            desc: "Formulated, structured, and executed end-to-end interactive student events and operational workflows. Led cross-functional student teams across logistics, marketing, and operations."
        },
        {
            title: "IBM Advanced Generative AI Certification",
            org: "IBM Career Education",
            date: "May 2026 - July 2026",
            desc: "Core Focus: Foundation Models, Transformers, LLMs, GANs, Diffusion Models, Advanced Prompt Engineering, and Agentic Deployment via IBM watsonx.ai, GitHub Copilot."
        }
    ];

    const skills = [
        { category: "Languages", tags: ["Python", "R Language", "SQL", "Java", "C/C++", "JavaScript", "HTML/CSS"] },
        { category: "Optimization & ML", tags: ["Google OR-Tools", "PyTorch", "TensorFlow", "Scikit-learn"] },
        { category: "AI Tools & Agents", tags: ["Claude Code", "MCP", "GitHub Copilot", "Cursor", "LLMs (Llama, Qwen)"] },
        { category: "Frameworks & Web", tags: ["FastAPI", "React", "Next.js", "Node.js", "Streamlit", "Vite"] },
        { category: "Cloud, DevOps & DB", tags: ["AWS (EC2)", "Docker", "Git", "Linux", "Nginx", "PostgreSQL", "SQLite", "Supabase"] },
        { category: "Data & Analytics", tags: ["NumPy", "pandas", "OpenCV", "Matplotlib", "Data Quality Assessment", "Lineage Tracking"] }
    ];

    return html`
        <div class="app-container">
            <${AuroraShader} 
                colorStops=${["#00d2ff", "#7cff67", "#5227FF"]} 
                amplitude=${1.3} 
                speed=${1.2} 
                blend=${0.6}
            />
            
            <nav>
                <div class="container">
                    <div class="logo">
                        <span class="gradient-text">&lt;Atrik/&gt;</span>
                    </div>
                    <div class="nav-links">
                        <a href="#about">About</a>
                        <a href="#skills">Skills</a>
                        <a href="#projects">Projects</a>
                        <a href="#experience">Experience</a>
                        <a href="#contact">Contact</a>
                    </div>
                </div>
            </nav>

            <section id="about" class="hero container">
                <div class="hero-content reveal">
                    <div class="hero-badge">
                        <div class="dot"></div>
                        Available for Opportunities
                    </div>
                    <h1>Hi, I'm <span class="gradient-accent">Atrik Samanta</span></h1>
                    <h2>AI & ML Engineer</h2>
                    <p style=${{ maxWidth: '650px', fontSize: '1.25rem', lineHeight: '1.8' }}>
                        B.Tech in Computer Science and Engineering (AI & ML) at VIT Vellore (CGPA: 7.9). 
                        Passionate about <strong style=${{color: '#fff'}}>Optimization</strong>, <strong style=${{color: '#fff'}}>Computer Vision</strong>, and <strong style=${{color: '#fff'}}>Generative AI</strong> to solve complex, real-world challenges.
                    </p>
                    
                    <div class="btn-group">
                        <a href="#projects" class="btn btn-primary">
                            View Projects <${ArrowRightIcon} />
                        </a>
                        <a href="https://github.com/ATRIK171005" target="_blank" class="btn btn-secondary">
                            <${GithubIcon} /> GitHub
                        </a>
                        <a href="https://www.linkedin.com/in/atrik-samanta-49a0603b6" target="_blank" class="btn btn-secondary">
                            <${LinkedinIcon} /> LinkedIn
                        </a>
                        <a href="http://localhost:8081" class="btn btn-secondary" style=${{ borderColor: 'var(--accent-1)' }}>
                            <${ArrowRightIcon} /> Localhost Link
                        </a>
                        <a href="mailto:samanta.atrik1710@gmail.com" class="btn btn-secondary">
                            <${MailIcon} /> Contact
                        </a>
                    </div>
                </div>
            </section>

            <section id="skills" class="container" style=${{ marginTop: '6rem' }}>
                <h2 class="reveal">Technical <span class="gradient-accent">Arsenal</span></h2>
                <div class="skills-grid">
                    ${skills.map((s, i) => html`
                        <div key=${i} class="glass-panel reveal delay-${(i % 3 + 1) * 100}">
                            <h3>${s.category}</h3>
                            <div class="tags">
                                ${s.tags.map(tag => html`<span key=${tag} class="tag">${tag}</span>`)}
                            </div>
                        </div>
                    `)}
                </div>
            </section>

            <section id="projects" class="container" style=${{ marginTop: '10rem' }}>
                <h2 class="reveal">Featured <span class="gradient-accent">Work</span></h2>
                <div class="projects-grid">
                    ${projects.map((p, i) => html`
                        <div key=${i} class="glass-panel reveal delay-${(i % 2 + 1) * 100}">
                            <span class="date">${p.date}</span>
                            <h3>${p.title}</h3>
                            <p>${p.desc}</p>
                            <div class="tags" style=${{ marginTop: 'auto', paddingTop: '1.5rem' }}>
                                ${p.tech.map(t => html`<span key=${t} class="tag">${t}</span>`)}
                            </div>
                        </div>
                    `)}
                </div>
            </section>

            <section id="experience" class="container" style=${{ marginTop: '10rem' }}>
                <h2 class="reveal">Experience & <span class="gradient-accent">Certifications</span></h2>
                <div class="experience-timeline reveal delay-200" style=${{ maxWidth: '900px' }}>
                    ${experience.map((e, i) => html`
                        <div key=${i} class="timeline-item glass-panel" style=${{ marginBottom: '2rem' }}>
                            <span class="date">${e.date}</span>
                            <h3 style=${{ marginBottom: '0.2rem' }}>${e.title}</h3>
                            <p style=${{ color: 'var(--accent-1)', fontWeight: 500, marginBottom: '1rem', fontSize: '1rem' }}>${e.org}</p>
                            <p style=${{ marginBottom: '1rem' }}>${e.desc}</p>
                        </div>
                    `)}
                </div>
            </section>

            <section id="contact" class="container" style=${{ marginTop: '10rem' }}>
                <h2 class="reveal">Get In <span class="gradient-accent">Touch</span></h2>
                <div class="contact-grid">
                    <div class="glass-panel reveal delay-100">
                        <h3 style=${{ marginBottom: '1.5rem' }}>Contact Information</h3>
                        <div class="contact-info">
                            <div class="contact-item">
                                <${MailIcon} />
                                <span>samanta.atrik1710@gmail.com</span>
                            </div>
                            <div class="contact-item">
                                <${PhoneIcon} />
                                <span>+91-7001913750</span>
                            </div>
                            <div class="contact-item">
                                <${LinkedinIcon} />
                                <a href="https://www.linkedin.com/in/atrik-samanta-49a0603b6" target="_blank" style=${{ color: 'inherit', textDecoration: 'none' }}>linkedin.com/in/atrik-samanta-49a0603b6</a>
                            </div>
                            <div class="contact-item">
                                <${GithubIcon} />
                                <a href="https://github.com/ATRIK171005" target="_blank" style=${{ color: 'inherit', textDecoration: 'none' }}>github.com/ATRIK171005</a>
                            </div>
                            <div class="contact-item">
                                <${ArrowRightIcon} />
                                <a href="http://localhost:8081" style=${{ color: 'var(--accent-1)', textDecoration: 'none' }}>http://localhost:8081</a>
                            </div>
                        </div>
                    </div>
                    
                    <div class="glass-panel reveal delay-200">
                        <form onsubmit=${(e) => { e.preventDefault(); alert('Message feature is a visual demo. Please use the email directly!'); }}>
                            <div class="form-group">
                                <label class="form-label">Name</label>
                                <input type="text" class="form-input" placeholder="John Doe" required />
                            </div>
                            <div class="form-group">
                                <label class="form-label">Email</label>
                                <input type="email" class="form-input" placeholder="john@example.com" required />
                            </div>
                            <div class="form-group">
                                <label class="form-label">Message</label>
                                <textarea class="form-textarea" placeholder="Hello Atrik..." required></textarea>
                            </div>
                            <button type="submit" class="btn btn-primary" style=${{ width: '100%', marginTop: '0.5rem' }}>Send Message</button>
                        </form>
                    </div>
                </div>
            </section>

            <footer class="container reveal" style=${{ textAlign: 'center', marginTop: '10rem', opacity: 0.5 }}>
                <div style=${{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    <a href="https://github.com/ATRIK171005" target="_blank" style=${{color: 'inherit'}}><${GithubIcon} /></a>
                    <a href="https://www.linkedin.com/in/atrik-samanta-49a0603b6" target="_blank" style=${{color: 'inherit'}}><${LinkedinIcon} /></a>
                </div>
                <p>© ${new Date().getFullYear()} Atrik Samanta. Built natively with Preact & OGL.</p>
            </footer>
        </div>
    `;
};

render(html`<${App} />`, document.getElementById("root"));
