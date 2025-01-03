import { useRef, useEffect, useState } from "react";
import classnames from "classnames";
import Pages from "../Pages";
import Sidebar from "./Sidebar";
import Spinner from "../Pages/spinner";
import { useGetMangaAndChapters } from "../../hooks/getMangaAndChapters";
import { useUpdateRecent } from "../../hooks/updateRecents";
import { useGetPages } from "../../hooks/getPages";
import { ModeContext } from "../../hooks/theme_provider";

const PageContainer = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pageRef = useRef<HTMLDivElement | null>(null);

  const [active, changeActive] = useState<number>(0);
  const [lockScroll, toggleLock] = useState<boolean>(false);

  const { loading, error, manga, chapters } = useGetMangaAndChapters();
  const result = useGetPages(chapters);

  const chapter = result ? result.chapter : null;
  const data = chapter ? chapter.data : [];

  // change the active page with slider
  const changeActivePage = (page: number) => {
    if (page > 0 && page <= data.length) changeActive(page);
  };

  useEffect(() => {
    const container = containerRef.current
    const page = pageRef.current

    const scrollOnActiveChange = () => {
      if (container && page) {

        const children = page.children;

        for (let i = 0; i < children.length; i++) {
          const child = children[i] as HTMLElement;
          const rect = child.getBoundingClientRect();

          if (!(rect.y <= 0 && rect.y + rect.height > 0)) {
            const index = child.dataset["index"]
              ? parseInt(child.dataset["index"])
              : 0;

            if (!isNaN(index) && active === index) {
              // lock the scroll
              toggleLock(true);

              container.scrollTo({
                top: rect.top + container.scrollTop,
              });

              // unlock the scroll
              toggleLock(false);
            }
          }
        }
      }
    };

    scrollOnActiveChange();
  }, [active, lockScroll]);

  useEffect(() => {
    const container = containerRef.current
    const page = pageRef.current

    const handleScroll = () => {
      if (container && page && !lockScroll) {
        const children = page.children;

        for (let i = 0; i < children.length; i++) {
          const child = children[i] as HTMLElement;
          const rect = child.getBoundingClientRect();

          if (rect.y <= 0 && rect.y + rect.height > 0) {
            const index = child.dataset["index"]
              ? parseInt(child.dataset["index"])
              : 0;

            // change the active Page
            if (!isNaN(index) && active !== index) changeActive(index);
          }
        }
      }
    };

    if (container) {
      container.addEventListener("scroll", handleScroll, true);
    }

    return () => {
      container && container.removeEventListener("scroll", handleScroll, true);
    };
  }, [active, lockScroll]);

  useUpdateRecent(manga, chapters);

  return (
    <ModeContext.Consumer>
      {({ theme }) => (
        <div
          ref={containerRef}
          className="w-full h-full flex flex-row flex-nowrap main_wrapper"
        >
          {manga && chapters && result ? (
            <Pages {...{ chapters, manga, result }} ref={pageRef} />
          ) : (
            <div className="hidden w-full h-screen md:flex flex-row items-center justify-center">
              <div
                className={classnames(
                  "w-10 h-10",
                  theme === "LIGHT"
                    ? "fill-primary-color"
                    : "fill-secondary_white",
                )}
              >
                <Spinner />
              </div>
            </div>
          )}
          <Sidebar {...{ loading, manga, chapters }} />
          {/*
            <FAB
              manga={manga}
              chapters={chapters}
              total={data.length}
              active={active}
              changeActive={changeActivePage}
            />*/
          }
        </div>
      )}
    </ModeContext.Consumer>
  );
};

export default PageContainer;
