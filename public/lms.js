/* Learnly LMS — Pure HTML/CSS/JS (no frameworks) */
(function(){
  const $ = (sel,scope=document)=>scope.querySelector(sel)
  const $$ = (sel,scope=document)=>Array.from(scope.querySelectorAll(sel))
  const STORAGE_KEY = 'learnly.v1'

  const defaultData = {
    users:[{id:'u1',name:'Alex Johnson',role:'student'},{id:'u2',name:'Taylor Smith',role:'instructor'}],
    courses:[
      {id:'c1',title:'Intro to Web Development',instructor:'Taylor Smith',tags:['HTML','CSS','JS'],lessons:[
        {id:'l1',title:'HTML Basics',dur:12,content:'Structure of a webpage, tags, and elements.'},
        {id:'l2',title:'CSS Essentials',dur:18,content:'Selectors, box model, flexbox and grid.'},
        {id:'l3',title:'JavaScript Primer',dur:20,content:'Variables, functions and DOM.'}
      ],enrolled:['u1'],progress:{u1:45}},
      {id:'c2',title:'UI/UX Design Fundamentals',instructor:'Taylor Smith',tags:['Design','Figma'],lessons:[
        {id:'l1',title:'Design Principles',dur:15,content:'Contrast, hierarchy, alignment, proximity.'},
        {id:'l2',title:'Wireframing',dur:22,content:'From sketches to low-fidelity prototypes.'}
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
    const [path, param] = hash.slice(1).split('?id=')
    return { path, id: param }
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
            <span class="chip">Lessons watched: ${enrolled.reduce((a,c)=>a + (c.progress[my.id] ? Math.round(c.progress[my.id]/10) : 0),0)}</span>
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
              `<li class='card'><div class='row row--between'><div><div class='card__title'>${i+1}. ${l.title}</div><div class='card__meta'>${l.dur} min</div></div>${enrolled?`<button class='btn btn--ghost' data-action='play' data-lesson='${l.id}' data-id='${course.id}'>Watch</button>`:''}</div></li>`
            ).join('')}
          </ul>
        </div>
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

    if(action==='play'){
      const { id, lesson } = btn.dataset
      const course = state.courses.find(c=>c.id===id)
      if(!course) return
      const idx = course.lessons.findIndex(l=>l.id===lesson)
      course.progress[state.myUser] = Math.min(100, ((idx+1)/course.lessons.length)*100)
      alert(`Playing: ${course.lessons[idx].title}. Progress set to ${Math.round(course.progress[state.myUser])}%`)
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
        lessons:[{id:'l1',title:'Getting Started',dur:8,content:'Welcome!'},{id:'l2',title:'Deep Dive',dur:16,content:'Core concepts.'}],
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
