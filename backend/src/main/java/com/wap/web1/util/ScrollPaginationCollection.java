package com.wap.web1.util;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import java.util.List;

@RequiredArgsConstructor(access = AccessLevel.PRIVATE)
public class ScrollPaginationCollection<T> {
    private final List<T> itemsWithNextCursor;
    private final int countPerScroll;

    public static <T> ScrollPaginationCollection<T> of(List<T> items, int size) {
        return new ScrollPaginationCollection<>(items,size);
    }

    public boolean isLastScroll() {
        return this.itemsWithNextCursor.size() <= countPerScroll;
    }

    public List<T> getCurrentScrollItems() {
        return isLastScroll() ? itemsWithNextCursor : itemsWithNextCursor.subList(0,countPerScroll);
    }
    public T getNextCursor() {
        return itemsWithNextCursor.get(countPerScroll-1);
    }
}
