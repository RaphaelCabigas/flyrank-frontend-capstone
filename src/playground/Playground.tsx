import { useRef, useState } from "react";
import { Disclosure } from "./Disclosure/Disclosure";
import { Modal } from "./Modal/Modal";
import { Tabs } from "./Tabs/Tabs";
import type { TabItem } from "./Tabs/Tabs";
import "./Playground.scss";

const demoTabs: TabItem[] = [
  {
    id: "overview",
    label: "Overview",
    content: <p>Tabs follow the APG tabs pattern with automatic activation.</p>,
  },
  {
    id: "keyboard",
    label: "Keyboard",
    content: (
      <p>Arrow keys move between tabs. Home and End jump to the ends.</p>
    ),
  },
  {
    id: "focus",
    label: "Focus",
    content: (
      <p>Only the selected tab is in the Tab order (roving tabindex).</p>
    ),
  },
];

export function Playground() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  return (
    <main className="playground">
      <h1 className="playground-title">Accessible component playground</h1>

      <section className="playground-section">
        <h2>Modal dialog</h2>
        <button
          type="button"
          className="playground-button"
          onClick={() => setIsModalOpen(true)}
        >
          Open modal
        </button>
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Edit profile"
          description="Tab cycles inside this dialog. Escape closes it."
          initialFocusRef={nameInputRef}
        >
          <label className="playground-field">
            Name
            <input
              ref={nameInputRef}
              type="text"
              className="playground-input"
            />
          </label>
          <div className="playground-actions">
            <button
              type="button"
              className="playground-button"
              onClick={() => setIsModalOpen(false)}
            >
              Save
            </button>
            <button
              type="button"
              className="playground-button"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </Modal>
      </section>

      <section className="playground-section">
        <h2>Tabs</h2>
        <Tabs tabs={demoTabs} label="Tabs demo" />
      </section>

      <section className="playground-section">
        <h2>Disclosure</h2>
        <Disclosure summary="What is a disclosure?">
          <p>A button that shows or hides a section of content.</p>
        </Disclosure>
      </section>
    </main>
  );
}
