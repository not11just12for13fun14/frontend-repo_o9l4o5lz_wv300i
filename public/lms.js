/* Learnly LMS — Pure HTML/CSS/JS (no frameworks) */
(function(){
  const $ = (sel,scope=document)=>scope.querySelector(sel)
  const $$ = (sel,scope=document)=>Array.from(scope.querySelectorAll(sel))
  const STORAGE_KEY = 'learnly.v1'

  const defaultData = {
    users:[{id:'u1',name:'Alex Johnson',role:'student'},{id:'u2',name:'Taylor Smith',role:'instructor'}],
    ui:{currentCourse:null,currentLesson:null},
    courses:[
      {id:'c1',title:'Intro to Web Development',instructor:'Taylor Smith',tags:['HTML','CSS','JS'],lessons:[
        {id:'l1',title:'HTML Basics',dur:12,content:'Learn the structure of a web page: doctype, html, head, body, and core tags (h1-h6, p, a, img, ul/ol, div/section). Practice by writing a simple page with a header, main content, and footer.'},
        {id:'l2',title:'CSS Essentials',dur:18,content:'Understand selectors, specificity, the box model, display types, and modern layout with Flexbox and Grid. Build a responsive two-column layout that stacks on mobile.'},
        {id:'l3',title:'JavaScript Primer',dur:20,content:'Get comfortable with variables (let/const), types, functions, conditionals, loops, and DOM selection/manipulation (querySelector, addEventListener). Make a button that toggles dark mode.'}
      ],enrolled:['u1'],progress:{u1:45}},

      // C Language (text content only)
      {id:'c_c',title:'C Programming – Foundations',instructor:'Learnly Team',tags:['C','Systems','Pointers'],lessons:[
        {id:'l1',title:'Getting Started with C',dur:12,content:'Install a compiler (gcc/clang). Learn file structure, main function, headers, include stdio.h, and how to compile and run using gcc file.c -o app && ./app.'},
        {id:'l2',title:'Data Types and Operators',dur:14,content:'Primitive types (char, int, float, double), signed vs unsigned, arithmetic and logical operators. Understand integer division and type conversion.'},
        {id:'l3',title:'Control Flow',dur:12,content:'if/else, switch, while, do-while, for loops. Practice by computing factorials and sums.'},
        {id:'l4',title:'Functions and Scope',dur:15,content:'Declare and define functions, pass by value, header prototypes, and scope rules (block vs file scope).'},
        {id:'l5',title:'Arrays and Strings',dur:16,content:'Static arrays, iteration, C strings (null-terminated), common pitfalls, and using functions like strlen, strcpy, strcmp safely.'},
        {id:'l6',title:'Pointers 101',dur:18,content:'Addresses, dereferencing, pointer arithmetic, arrays vs pointers, and passing pointers to functions to modify values.'},
        {id:'l7',title:'Dynamic Memory',dur:18,content:'malloc, calloc, realloc, free. Avoid memory leaks and double frees. Build a dynamic array example.'},
        {id:'l8',title:'Structs and Files',dur:16,content:'Define structs, nested structs, and read/write files with fopen, fprintf, fscanf, fclose. Create a small contacts file.'}
      ],enrolled:[],progress:{}},

      // C++ Language
      {id:'c_cpp',title:'Modern C++ – Essentials',instructor:'Learnly Team',tags:['C++','OOP','STL'],lessons:[
        {id:'l1',title:'Tooling and Basics',dur:12,content:'Use g++ or clang++. Understand i/o with iostream, namespaces, auto, and RAII basics.'},
        {id:'l2',title:'OOP in C++',dur:16,content:'Classes, objects, access specifiers, constructors/destructors, copy vs move semantics.'},
        {id:'l3',title:'STL Containers',dur:16,content:'vector, string, map, unordered_map, set. Iterators and range-for loops.'},
        {id:'l4',title:'Algorithms and Lambdas',dur:14,content:'std::sort, std::find, std::accumulate; lambda expressions and captures.'},
        {id:'l5',title:'Memory Management',dur:16,content:'Smart pointers (unique_ptr, shared_ptr), references, avoiding raw new/delete when possible.'},
        {id:'l6',title:'Templates and Generics',dur:18,content:'Function and class templates, type inference, template specialization overview.'},
        {id:'l7',title:'Error Handling',dur:12,content:'Exceptions, noexcept, and alternatives like std::optional and expected-like patterns.'},
        {id:'l8',title:'Files and Build Systems',dur:14,content:'fstream for file i/o, and intro to CMake for multi-file projects.'}
      ],enrolled:[],progress:{}},

      // Java Language
      {id:'c_java',title:'Java Programming – From Basics to OOP',instructor:'Learnly Team',tags:['Java','OOP','JVM'],lessons:[
        {id:'l1',title:'Java Setup and Syntax',dur:12,content:'Install JDK, use javac/java. Understand classes, main method, packages, and basic types.'},
        {id:'l2',title:'Control Flow and Methods',dur:14,content:'if/else, switch, loops, methods, overloading, pass-by-value semantics.'},
        {id:'l3',title:'Objects and Classes',dur:16,content:'Fields, constructors, getters/setters, this, and object lifecycle.'},
        {id:'l4',title:'Inheritance and Polymorphism',dur:16,content:'extends, super, overriding, abstract classes, interfaces, and dynamic dispatch.'},
        {id:'l5',title:'Collections Framework',dur:16,content:'List, Set, Map; ArrayList vs LinkedList; HashMap vs TreeMap; iteration patterns.'},
        {id:'l6',title:'Generics and Streams',dur:18,content:'Generic classes/methods, type erasure concept, Stream API basics (map, filter, reduce).'},
        {id:'l7',title:'Exceptions and Files',dur:14,content:'try/catch/finally, checked vs unchecked, try-with-resources, java.nio file i/o.'},
        {id:'l8',title:'Build Tools',dur:12,content:'Intro to Maven/Gradle, project structure, and dependency management.'}
      ],enrolled:[],progress:{}},

      // HTML
      {id:'c_html',title:'HTML – Semantic Markup Deep Dive',instructor:'Learnly Team',tags:['HTML','Accessibility'],lessons:[
        {id:'l1',title:'Document Structure',dur:10,content:'doctype, html/lang, head meta tags, title, linking styles and scripts.'},
        {id:'l2',title:'Text and Media',dur:12,content:'Headings, paragraphs, links, images, figure/figcaption, video/audio basics (no hosting).'},
        {id:'l3',title:'Semantic Layout',dur:14,content:'header, nav, main, section, article, aside, footer — when and why to use them.'},
        {id:'l4',title:'Forms',dur:16,content:'input types, labels, accessibility, validation attributes, and form structure.'},
        {id:'l5',title:'Accessibility Essentials',dur:14,content:'alt text, landmarks, aria basics, focus order, keyboard navigation.'},
        {id:'l6',title:'SEO Basics',dur:10,content:'Head tags, metadata, sitemaps, and content structure for search engines.'}
      ],enrolled:[],progress:{}},

      // CSS
      {id:'c_css',title:'CSS – Layouts and Architecture',instructor:'Learnly Team',tags:['CSS','Responsive'],lessons:[
        {id:'l1',title:'Selectors and Specificity',dur:12,content:'Universal, type, class, id selectors, attribute selectors, pseudo-classes/elements.'},
        {id:'l2',title:'Box Model and Positioning',dur:14,content:'margin, border, padding, content; relative/absolute/fixed/sticky positioning.'},
        {id:'l3',title:'Flexbox',dur:14,content:'Main/cross axes, justify-content, align-items, wrapping; build a nav bar and card grid.'},
        {id:'l4',title:'CSS Grid',dur:16,content:'Implicit vs explicit grids, repeat/auto-fit, grid areas; create a responsive dashboard.'},
        {id:'l5',title:'Responsive Design',dur:14,content:'Mobile-first, media queries, fluid typography, container queries overview.'},
        {id:'l6',title:'Architecture',dur:12,content:'BEM, utility-first approaches, variables, theming, and maintainable CSS practices.'}
      ],enrolled:[],progress:{}},

      // JavaScript
      {id:'c_js',title:'JavaScript – From Core to the DOM',instructor:'Learnly Team',tags:['JavaScript','ES6+'],lessons:[
        {id:'l1',title:'Values and Types',dur:12,content:'Primitives vs objects, equality, truthiness, and coercion basics.'},
        {id:'l2',title:'Functions and Scope',dur:14,content:'Declarations vs expressions, arrow functions, closures, and lexical scope.'},
        {id:'l3',title:'Objects and Arrays',dur:14,content:'Destructuring, spread/rest, prototypes vs classes, and immutability tips.'},
        {id:'l4',title:'Async JavaScript',dur:16,content:'Promises, async/await, fetch API, and error handling patterns.'},
        {id:'l5',title:'DOM and Events',dur:14,content:'Selecting, creating, and updating nodes; event propagation; delegation; performance hints.'},
        {id:'l6',title:'Modules and Tooling',dur:12,content:'ES modules, bundlers conceptually, and organizing code effectively.'}
      ],enrolled:[],progress:{}},

      // MERN Stack (text modules only)
      {id:'c_mern',title:'MERN Stack – Step by Step (Text Only)',instructor:'Learnly Team',tags:['MongoDB','Express','React','Node'],lessons:[
        {id:'l1',title:'Overview and Setup',dur:12,content:'What MERN means, when to use it, and setting up Node/npm, MongoDB, and project folders.'},
        {id:'l2',title:'MongoDB Basics',dur:16,content:'Documents vs collections, schema design tips, CRUD operations, and indexes.'},
        {id:'l3',title:'Express API',dur:16,content:'Create REST endpoints, middleware, routing, validation, and error handling.'},
        {id:'l4',title:'React Fundamentals',dur:16,content:'Components, state, props, hooks, and simple forms for CRUD UIs.'},
        {id:'l5',title:'Connecting Frontend and Backend',dur:14,content:'Consuming APIs with fetch/axios, CORS, environment variables.'},
        {id:'l6',title:'Auth Basics',dur:16,content:'JWT-based authentication, protecting routes, storing tokens securely.'},
        {id:'l7',title:'Production Considerations',dur:14,content:'Env management, logging, rate limiting, and basic deployment patterns.'},
        {id:'l8',title:'Mini Project Plan',dur:14,content:'Plan a CRUD app with users and posts, break into tasks, and iterate.'}
      ],enrolled:[],progress:{}},
    ],
    myUser:'u1'
  }

  // State persistence
  function load(){
    try{const raw=localStorage.getItem(STORAGE_KEY);return raw?JSON.parse(raw):structuredClone(defaultData)}catch(e){return structuredClone(defaultData)}
  }
  function save(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) }
  let state = load()

  // Router (hash-based)
  const routes = {
    '/': Home,
    '/courses': Courses,
    '/course': CourseDetail,
    '/learning': MyLearning,
    '/admin': Admin
  }
  function navigate(path){
    window.location.hash = path
  }
  function getPath(){
    const hash = window.location.hash || '#/'
    const [path, rest] = hash.slice(1).split('?')
    const params = new URLSearchParams(rest||'')
    return { path, id: params.get('id'), l: params.get('l') }
  }

  // Components
  function Home(){
    const my = state.users.find(u=>u.id===state.myUser)
    const enrolled = state.courses.filter(c => c.enrolled.includes(my.id))
    const recommended = state.courses.filter(c => !c.enrolled.includes(my.id))
    return `
      <section class="section-title">
        <div>
          <h1 class="h1">Welcome back, ${my.name.split(' ')[0]} 👋</h1>
          <p class="muted">Continue where you left off, or explore something new.</p>
        </div>
        <div class="chips">
          <span class="chip">Student</span>
          <span class="chip">Streak: 5 days</span>
        </div>
      </section>

      <div class="grid grid--3">
        <div class="panel">
          <div class="row row--between"><h3>In Progress</h3><a class="muted" href="#/learning">View all →</a></div>
          <div class="list">
            ${enrolled.length? enrolled.map(CourseCard).join('') : `<div class='empty'>You have no enrollments yet.</div>`}
          </div>
        </div>
        <div class="panel">
          <div class="row row--between"><h3>Recommended</h3><a class="muted" href="#/courses">Browse →</a></div>
          <div class="list">${recommended.map(CourseCard).join('')}</div>
        </div>
        <div class="panel">
          <h3>Your stats</h3>
          <div class="chips">
            <span class="chip">Lessons read: ${enrolled.reduce((a,c)=>a + (c.progress[my.id] ? Math.round(c.progress[my.id]/10) : 0),0)}</span>
            <span class="chip">Courses: ${enrolled.length}</span>
            <span class="chip">Badges: 2</span>
          </div>
        </div>
      </div>
    `
  }

  function Courses(){
    const query = $('#search')?.value?.toLowerCase() || ''
    const filtered = state.courses.filter(c => c.title.toLowerCase().includes(query) || c.tags.join(' ').toLowerCase().includes(query))
    return `
      <section class="section-title">
        <div>
          <h1 class="h1">All Courses</h1>
          <p class="muted">Search, preview, and enroll.</p>
        </div>
        <div class="row">
          <input id="search" class="input" placeholder="Search by title or tag" value="${query}" />
          <button class="btn" data-action="search">Search</button>
        </div>
      </section>
      <div class="grid grid--3">${filtered.map(CourseCard).join('')}</div>
    `
  }

  function CourseDetail(){
    const { id } = getPath()
    const course = state.courses.find(c=>c.id===id)
    if(!course) return `<div class='empty'>Course not found.</div>`
    const me = state.myUser
    const enrolled = course.enrolled.includes(me)
    const progress = Math.min(100, Math.round(course.progress[me] || 0))

    const currentL = (state.ui?.currentCourse===id) ? state.ui.currentLesson : null
    const lessonObj = currentL ? course.lessons.find(l=>l.id===currentL) : null

    return `
      <div class="section-title">
        <div>
          <h1 class="h1">${course.title}</h1>
          <p class="muted">By ${course.instructor}</p>
        </div>
        <div class="chips">${course.tags.map(t=>`<span class='chip'>${t}</span>`).join('')}</div>
      </div>
      <div class="grid">
        <div class="panel">
          <h3>About this course</h3>
          <p class="muted">${course.summary || 'Learn essential skills through bite-sized lessons and hands-on practice.'}</p>
          <div class="progress" aria-label="Progress"><div class="progress__bar" style="width:${progress}%"></div></div>
          <div class="row" style="margin-top:12px;gap:8px">
            ${enrolled?`<button class='btn' data-action='continue' data-id='${course.id}'>Continue</button>`:`<button class='btn' data-action='enroll' data-id='${course.id}'>Enroll</button>`}
            <button class="btn btn--ghost" data-action="share" data-id='${course.id}'>Share</button>
          </div>
        </div>
        <div class="panel">
          <h3>Curriculum</h3>
          <ul class="list">
            ${course.lessons.map((l,i)=>
              `<li class='card'><div class='row row--between'><div><div class='card__title'>${i+1}. ${l.title}</div><div class='card__meta'>${l.dur} min</div></div>${enrolled?`<button class='btn btn--ghost' data-action='read' data-lesson='${l.id}' data-id='${course.id}'>Read</button>`:''}</div></li>`
            ).join('')}
          </ul>
        </div>
        ${enrolled? `<div class="panel panel--soft">
          <h3>Reader</h3>
          ${lessonObj? `
            <h4 style="margin-top:6px">${course.lessons.findIndex(l=>l.id===lessonObj.id)+1}. ${lessonObj.title}</h4>
            <div class="muted" style="white-space:pre-wrap;margin-top:6px">${lessonObj.content}</div>
            <div class='row' style='gap:8px;margin-top:12px'>
              <button class='btn btn--ghost' data-action='prev-lesson' data-id='${course.id}'>Previous</button>
              <button class='btn' data-action='next-lesson' data-id='${course.id}'>Next</button>
            </div>
          ` : `<div class='empty'>Select a lesson to start reading.</div>`}
        </div>`:''}
      </div>
    `
  }

  function MyLearning(){
    const me = state.myUser
    const list = state.courses.filter(c=>c.enrolled.includes(me))
    return `
      <section class="section-title">
        <div>
          <h1 class="h1">My Learning</h1>
          <p class="muted">Pick up where you left off.</p>
        </div>
      </section>
      ${list.length? `<div class='grid grid--3'>${list.map(CourseCard).join('')}</div>` : `<div class='empty'>Nothing here yet. Browse courses and enroll.</div>`}
    `
  }

  function Admin(){
    const isInstructor = state.users.find(u=>u.id===state.myUser)?.role==='instructor'
    if(!isInstructor){return `<div class='empty'>Admin is restricted. Switch role to instructor in the demo settings below.</div>`}
    return `
      <section class="section-title">
        <div>
          <h1 class="h1">Admin</h1>
          <p class="muted">Create and manage courses.</p>
        </div>
      </section>
      <div class="grid">
        <form class="panel" id="courseForm">
          <div class="row"><input class="input" name="title" placeholder="Course title" required></div>
          <div class="row"><input class="input" name="tags" placeholder="Tags (comma separated)"></div>
          <div class="row"><textarea name="summary" rows="3" placeholder="Short summary" class="input"></textarea></div>
          <div class="row row--between">
            <button class="btn" type="submit">Create course</button>
            <button class="btn btn--ghost" type="button" data-action="add-fake">Add example</button>
          </div>
        </form>
        <div class="panel panel--soft">
          <h3>All courses</h3>
          <table class="table">
            <thead><tr><th>Title</th><th>Tags</th><th>Students</th><th></th></tr></thead>
            <tbody>
              ${state.courses.map(c=>`<tr>
                <td>${c.title}</td><td>${c.tags.join(', ')}</td><td>${c.enrolled.length}</td>
                <td class='row' style='justify-content:flex-end'>
                  <button class='btn btn--ghost' data-action='edit' data-id='${c.id}'>Edit</button>
                  <button class='btn btn--danger' data-action='delete' data-id='${c.id}'>Delete</button>
                </td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
        <div class="panel">
          <h3>Demo settings</h3>
          <div class="row" style="align-items:center">
            <label class="muted">Current user</label>
            <select class="select" id="userSelect">
              ${state.users.map(u=>`<option value='${u.id}' ${u.id===state.myUser?'selected':''}>${u.name} (${u.role})</option>`).join('')}
            </select>
          </div>
        </div>
      </div>
    `
  }

  // Small UI helpers
  function CourseCard(c){
    const me = state.myUser
    const enrolled = c.enrolled.includes(me)
    const progress = Math.round(c.progress[me] || 0)
    return `<article class='card'>
      <div class='row row--between'>
        <div>
          <h4 class='card__title'>${c.title}</h4>
          <div class='card__meta'>By ${c.instructor} • ${c.tags.join(' · ')}</div>
        </div>
        <span class='badge'>${enrolled? 'Enrolled' : 'New'}</span>
      </div>
      <div class='progress' style='margin:10px 0'><div class='progress__bar' style='width:${progress}%'></div></div>
      <div class='row' style='gap:8px'>
        <a class='btn' href='#/course?id=${c.id}'>${enrolled? 'Continue' : 'Preview'}</a>
        ${enrolled? '' : `<button class='btn btn--ghost' data-action='enroll' data-id='${c.id}'>Enroll</button>`}
      </div>
    </article>`
  }

  // Render engine
  const root = $('#app-root')
  function render(){
    const { path } = getPath()
    const view = routes[path] || Home
    root.innerHTML = view()
  }

  // Event delegation
  document.addEventListener('click', (e)=>{
    const a = e.target.closest('[data-link]')
    if(a){ e.preventDefault(); navigate(a.getAttribute('href').slice(1)); return }

    const btn = e.target.closest('button')
    if(!btn) return
    const action = btn.getAttribute('data-action')
    if(!action) return

    if(action==='search') render()

    if(action==='enroll'){
      const id = btn.dataset.id
      const course = state.courses.find(c=>c.id===id)
      if(course && !course.enrolled.includes(state.myUser)){
        course.enrolled.push(state.myUser)
        course.progress[state.myUser]=0
        save(); render()
      }
    }

    if(action==='continue'){
      const id = btn.dataset.id
      navigate(`/course?id=${id}`)
    }

    if(action==='read'){
      const { id, lesson } = btn.dataset
      const course = state.courses.find(c=>c.id===id)
      if(!course) return
      const idx = course.lessons.findIndex(l=>l.id===lesson)
      // track UI selection and progress
      state.ui = state.ui || {currentCourse:null,currentLesson:null}
      state.ui.currentCourse = id
      state.ui.currentLesson = lesson
      course.progress[state.myUser] = Math.min(100, ((idx+1)/course.lessons.length)*100)
      save(); render()
    }

    if(action==='prev-lesson' || action==='next-lesson'){
      const id = btn.dataset.id
      const course = state.courses.find(c=>c.id===id)
      if(!course || !state.ui || state.ui.currentCourse!==id) return
      const idx = course.lessons.findIndex(l=>l.id===state.ui.currentLesson)
      let nextIdx = action==='next-lesson'? idx+1 : idx-1
      nextIdx = Math.max(0, Math.min(course.lessons.length-1, nextIdx))
      state.ui.currentLesson = course.lessons[nextIdx].id
      course.progress[state.myUser] = Math.min(100, ((nextIdx+1)/course.lessons.length)*100)
      save(); render()
    }

    if(action==='share'){
      navigator.clipboard.writeText(location.href)
      btn.textContent = 'Copied!'
      setTimeout(()=>btn.textContent='Share',1200)
    }

    if(action==='delete'){
      const id = btn.dataset.id
      if(confirm('Delete this course?')){
        state.courses = state.courses.filter(c=>c.id!==id)
        save(); render()
      }
    }

    if(action==='edit'){
      const id = btn.dataset.id
      const course = state.courses.find(c=>c.id===id)
      const title = prompt('Update title', course.title)
      if(title){ course.title = title; save(); render() }
    }
  })

  document.addEventListener('submit', (e)=>{
    if(e.target && e.target.id==='courseForm'){
      e.preventDefault()
      const fd = new FormData(e.target)
      const id = 'c'+Math.random().toString(36).slice(2,7)
      const now = {
        id,
        title: fd.get('title'),
        instructor: state.users.find(u=>u.id===state.myUser)?.name || 'Instructor',
        tags: String(fd.get('tags')||'').split(',').map(s=>s.trim()).filter(Boolean),
        summary: fd.get('summary'),
        lessons:[{id:'l1',title:'Getting Started',dur:8,content:'Welcome! This is a text-based lesson.'},{id:'l2',title:'Deep Dive',dur:16,content:'Core concepts explained with examples.'}],
        enrolled:[],progress:{}
      }
      state.courses.unshift(now)
      save(); e.target.reset(); alert('Course created!'); render()
    }
  })

  document.addEventListener('change', (e)=>{
    if(e.target && e.target.id==='userSelect'){
      state.myUser = e.target.value
      save(); render()
    }
  })

  // Footer actions
  $('#resetBtn')?.addEventListener('click', ()=>{
    if(confirm('Reset all demo data?')){ state = structuredClone(defaultData); save(); render() }
  })

  // Boot
  window.addEventListener('hashchange', render)
  render()
})();
