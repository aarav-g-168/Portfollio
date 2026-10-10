import { locations } from '../constants/index'
import clsx from 'clsx'
import { useGSAP } from '@gsap/react'
import { Draggable } from 'gsap/Draggable'
import useWindowStore from '../store/window'
import useLocationStore from '../store/location'

const projects = locations.work?.children ?? [];

const Home = () => {
    const { setActiveLocation } = useLocationStore();

    const { openWindow } = useWindowStore();

    const handleOpenProjectFinder = (project) => {
        setActiveLocation(project);
        openWindow("finder");
    };

    useGSAP(() => {
        const folders = Draggable.create(".folder", { bounds: "main" });
        return () => folders.forEach((folder) => folder.kill());
    }, [])

    return (
        <section id="home">
        <ul>
            {projects.map((project) => (
            <li key={project.id} className={clsx("group folder", project.windowPosition)}>
              <button type="button" onClick={() => handleOpenProjectFinder(project)} aria-label={`Open ${project.name} project`}>
                <img src="/images/folder.png" alt="" />
                <p>{project.name}</p>
              </button>
            </li>
            ))}
        </ul>
        </section>
    )
}

export default Home
