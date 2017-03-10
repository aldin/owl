package com.atlantbh.test.reporter.controllers;

import com.atlantbh.test.reporter.filters.TestRunFilter;
import com.atlantbh.test.reporter.models.TestRun;
import com.atlantbh.test.reporter.services.TestRunService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * Test Run controller. All test run related APIs entries are here.
 *
 * @author Kenan Klisura
 */
@RestController
@RequestMapping(value = "/api/v1/test-runs")
public class TestRunsController {
	private TestRunService testRunService;

	/**
	 * Sets test run service.
	 *
	 * @param testRunService the test run service
	 */
	@Autowired
	public void setTestRunService(TestRunService testRunService) {
		this.testRunService = testRunService;
	}

	/**
	 * API: GET /api/v1/test-runs
	 *
	 * Returns paginated result of all test runs. Pagination is controlled via size and page query params.
	 *
	 * @param page    Spring page object.
	 * @param filter Filter object passed by query params.
	 * @return Paginated result of all test runs.
	 */
	@CrossOrigin(origins = "*")
	@RequestMapping(method = RequestMethod.GET)
	public Page<TestRun> getAllTestRuns(Pageable page, TestRunFilter filter) {
		return testRunService.getAllTestRuns(filter, page);
	}
}
